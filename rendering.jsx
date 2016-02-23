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
                <title>
                    {data.title}    
                </title>
            </head>
            <body>
                <div>
                     <h3>Reddit Clone</h3>
                     <a href="/">Home</a>
                     <a href="/login">Login</a>
                     <a href="/signup">Signup</a>
                     <a href="/createContent">Create a post</a>
                </div>
                {data.children}
            </body>
        </html>
        
        )
}



function renderLogin(data) {

    var structure = (
        <Layout title="Login!">
                <h1>Login</h1>
                <form action='/login' method='post'>
                    {data.error && <div>{data.error}</div>}
                    <div>
                        <input type="text" name="username" placeholder="Enter your username" /></div>
                    <div>
                        <input type="password" name="password" placeholder="Enter your password" />
                    </div>
                        <button type="submit">Log in!</button>
                </form>
            </Layout>
    );
    // return the html
    var html = renderHtml(structure);

    return html;
}    


function renderSignup(data) {

    var structure = (
        <Layout title="Reddit Clone Signup">
                <h1>Signup</h1>
                <form action='/signup' method='post'>
                    {data.error && <div>{data.error}</div>}
                    <div>
                        <input type="text" name="email" placeholder="Enter your email" />
                    </div>
                    <div>
                        <input type="text" name="username" placeholder="Enter your username"/>
                    </div>
                    <div>
                        <input type="password" name="password" placeholder="Enter your password" />
                    </div>
                        <button type="submit">Sign Up!</button>
                </form>
            </Layout>
    );
    // return the html
    var html = renderHtml(structure);

    return html;
}    

function renderContent(data) {

    var structure = (
        <Layout title="Post on Reddit Clone">
                <h1>Post!</h1>
                <form action='/createContent' method='post'>
                    {data.error && <div>{data.error}</div>}
                    <div>
                        <input type="text" name="url" placeholder="link to awesome content" />
                    </div>
                    <div>
                        <input type="text" name="title" placeholder="Give the awesome content a sweet title" />
                    </div>
                        <button type="submit">Post it!</button>
                </form>
            </Layout>
    );
    // return the html
    var html = renderHtml(structure);

    return html;
}   

function renderHome(data) {
    // console.log(data)
    
    // var renderVote = lkjhrge;
    
    var listResults = data.map(
        function (item) {
            return (
                <li className="content-item" key={item.id} >
                    <h2 className="content-item__title">
                        <a href={item.url}>{item.title}</a>
                    </h2>
                    <p>Created by {item.user.username}</p>
               
                <form action="/voteContent" method="post">
                    <input type="hidden" name="upVote" value="true" />
                    <input type="hidden" name="contentId" value={item.id} />
                    <button type="submit">upvote this</button>
                </form>
                    <div>
                        <a>{item.voteScore /*? item.voteScore : 0*/}</a>
                    </div>
                <form action="/voteContent" method="post">
                    <input type="hidden" name="upVote" value="false" />
                    <input type="hidden" name="contentId" value={item.id} />
                    <button type="submit">downvote this</button>
                </form>
                 </li>
                )
        });
    
    
    var structure = (
        <Layout title="Nic's Reddit Clone!">
                <div id="contents">
                    <h1>List of contents</h1>
                </div>
                <div>
                      <a href="/">Top</a>
                      <a href="/newest">Newest</a>
                </div>
                
                <div>     
                     <ul className="contents-list">
                     {listResults}
                    </ul>
                </div>
             </Layout>
        );
     var html = renderHtml(structure);

    return html;
}


module.exports = {
    renderLogin: renderLogin,
    renderSignup: renderSignup,
    renderContent: renderContent,
    renderHome: renderHome
};