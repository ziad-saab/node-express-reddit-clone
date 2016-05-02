var React = require('react');
var ReactDOMServer = require('react-dom/server');


function renderHtml(jsxStructure) {
  var outputHtml = ReactDOMServer.renderToStaticMarkup(jsxStructure);

  return '<!doctype html>' + outputHtml;
}
function Layout(data) {
  return (
    <html>
        <section>
            <nav>
                <head>
                    <link rel="stylesheet" type="text/css" href="style.css"></link>
                        <title>{data.title}</title>
                </head>
            </nav>
            <body>
                {data.children}
            </body>
        </section>
    </html>
  );
}

function renderLogin(data){
    var structure = (
        <Layout title = 'Login!'>
            <h1>Login</h1>
            <form action="/login" method="post">
            {data.error && <div>{data.error}</div>}
            <div>
                <input type="text" name="username" placeholder="Enter your Username"/>
            </div>
            <div>
                <input type="password" name="password" placeholder="Enter your Password"/>
            </div>
            <button type="submit">Login!</button>
            </form>
        </Layout>
        );
    var html = renderHtml(structure);
    return html;
}

function renderSignup(data){
    var structure = (
        <Layout title="Signup!">
            <h1>Signup</h1>
            <form action="/signup" method="post">
            {data.error && <div>{data.error}</div>}
            <div>
                <input type="text" name="username" placeholder="Enter a Username"/>
            </div>
            <div>
                <input type="password" name="password" placeholder="Enter a Password"/>
            </div>
            <button type="submit">Signup!</button>
            </form>
        </Layout>
        );
    var html = renderHtml(structure);
    return html;
}

function renderCreateContent(data){
    var structure = (
        <Layout title='Share a link!'>
            <h1>Share content</h1>
            <form action="/createContent" method="post">
            {data.error && <div>{data.error}</div>}
            <div>
                <input type="text" name="url" placeholder="Enter a URL"/>
            </div>
            <div>
                <input type="text" name="title" placeholder="Enter a Post Title"/>
            </div>
            <button type="submit">Submit!</button>
            </form>
        </Layout>
        );
    var html = renderHtml(structure);
    return html;
}

function renderHomepage(data) {
    var structure = (
    <Layout>
        <div id="contents">
        <h1>List of contents</h1>
        <ul className="contents-list">
        
         {data.map(function(item) {
            return (
            <li className="content-item">
                <div className="full-content">
                    <h2 className="content-item__title">
                        <a href={item.url}>{item.title}</a>
                    </h2>
                    <p className="content-item__user"> {item.user.username}</p>
                </div>
                <div className="full-form">
                    <form className="form" action="/voteContent" method="post">
                        <input type="hidden" name="upVote" value="true"/>
                        <input type="hidden" name="contentId" value={item.id}/>
                        <button type="submit">Upvote this!</button>
                    </form>
                    <p className="form">{item.dataValues.voteScore ? item.dataValues.voteScore : 0}</p>
                    <form className="form" action="/voteContent" method="post">
                        <input type="hidden" name="upVote" value="false"/>
                        <input type="hidden" name="contentId" value={item.id}/>
                        <button type="submit">Downvote this!</button>
                    </form>
                </div>
            </li>
            )
        })}
        
        </ul>
        </div>
    </Layout>
)
    var html = renderHtml(structure);
    return html;
}
module.exports = {renderLogin: renderLogin, renderSignup: renderSignup, renderCreateContent: renderCreateContent, renderHomepage: renderHomepage}