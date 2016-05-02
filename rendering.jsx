var React = require('react');
var ReactDOMServer = require('react-dom/server');

function renderHtml(jsxStructure) {
    var outputHtml = ReactDOMServer.renderToStaticMarkup(jsxStructure);
    return '<!doctype html>' + outputHtml;
}

function Layout(data) {
  return (
    <html>
      <head>
        <title>{data.title}</title>
        <link rel="stylesheet" href="app.css" type="text/css" />
      </head>
      <body>
      <h1>REDDIT THE CLONE where imitations surpasses originality</h1>
      {/*data.children is anything passed inside the Layout tags*/}
      {data.children}
      <script type="text/javascript" src="https://code.jquery.com/jquery-2.2.1.js"></script>
      <script src="manipulation.js"></script>
      </body>
    </html>
  );
}

var arrFunctions = {
    renderLogin: function(data){
        var structure = (
    <Layout title={data.title}>
      <h1>Login</h1>
      <form action="/login" method="post">
          {data.error && <div>{data.error}</div>}
          <input type="text" name="username"/>
          <input type="password" name="password" placeholder="Enter your password"/>
          <button type="submit">Sign in!</button>
      </form>
    </Layout>
  );
  // return the html
  var html = renderHtml(structure);

  return html;
    }, 
    renderSignup: function(data) {
        var structure = (
                <Layout title={data.title}>
                    <h1>Sign up!</h1>
                    <form action="/signup" method="post">
                        {data.error && <div>{data.error}</div>}
                        <input type="text" name="username" placeholder="Create a username"/>
                        <input type="password" name="password" placeholder="Create a password"/>
                        <input type="password" name="confirmPassword" placeholder="Confirm password"/>
                        <button type="submit">Sign up!</button>
                    </form>
                </Layout>
        );
        var html = renderHtml(structure);
        return html;
    },
    renderCreatePost: function(data) {
        var structure = (
            <Layout title={data.title}>
                <title>Create Post</title>
                <h1>Create your post</h1>
                <form action="/createPost" method="post">
                    {data.error && <div>{data.error}</div>}
                    <input type="text" name="url" placeholder="Enter a URL to content"/>
                    <input type="text" name="title" placeholder="Enter the title of your content"/>
                    <button type="submit">Create!</button>
                </form>
            </Layout>
        );
        var html = renderHtml(structure);
        return html;
    },
    homePage: function(data) {
        var structure = (
                <Layout title={data.title}>
                    <title>Homepage</title>
                    <h1>List of contents</h1>
                    <ol>
                        {
                            data.map(function(li) {
                                if (li.dataValues.voteCount > 1 && li.dataValues.voteScore == 0) {
                                    li.dataValues.voteScore = -1;
                            }
                            return (
                                    <li>
                                        <div className="container">
                                            <div>
                                                <div className="titleurl">
                                                    <h1>{li.title}</h1>
                                                    <a href={"http://"+li.url}>{li.url}</a>
                                                </div>
                                                <h3>Created by {li.User.dataValues.userName}</h3>
                                            </div>
                                            <div className="center">
                                                <div className="top">
                                                    <form action='/voteContent' method='post'>
                                                        <input type='hidden' name='upVote' value='true'/>
                                                        <input type='hidden' name='contentId' value={li.id}/>
                                                        <input type="button" className="upVoteBtn" id={li.id + "upVote"} value="upvote this"/>
                                                    
                                                    </form>
                                                </div>
                                                <div className={li.id}>
                                                    {li.dataValues.voteScore}
                                                </div>
                                                <div>
                                                    <form action='/voteContent' method='post'>
                                                        <input type='hidden' name='upVote' value='false'/>
                                                        <input type='hidden' name='contentId' value={li.id}/>
                                                        <input type="button" className="downVoteBtn" id={li.id + "downVote"}  value="downvote this" />
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })
                        }
                    </ol>
                </Layout>
        );
        return renderHtml(structure);
    }
};

module.exports = arrFunctions;