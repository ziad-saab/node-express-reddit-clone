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
            <head>
                <nav>
                    <title>{data.title}</title>
                </nav>
            </head>
            <body>
                {data.children}
            </body>
        </section>
    </html>
  );
}

function renderLogin(data){
    var structure = (
        <html>
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
        </html>
        );
    var html = renderHtml(structure);
    return html;
}

function renderSignup(data){
    var structure = (
        <html>
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
        </html>
        );
    var html = renderHtml(structure);
    return html;
}

function renderCreateContent(data){
    var structure = (
        <html>
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
        </html>
        );
    var html = renderHtml(structure);
    return html;
}

function renderHomepage(data) {
    var structure = (
    <html>
        <Layout>
            <div id="contents">
            <h1>List of contents</h1>
            <ul className="contents-list">
            
             {data.map(function(item) {
                return (
                <li className="content-item">
                    <h2 className="content-item__title">
                        <p>{item.dataValues.voteScore ? item.dataValues.voteScore : 0}</p>
                        <a href={item.url}>{item.title}</a>
                    </h2>
                    <p> {item.user.username}</p>
                    <form action="/voteContent" method="post">
                        <input type="hidden" name="upVote" value="true"/>
                        <input type="hidden" name="contentId" value={item.id}/>
                        <button type="submit">Upvote this!</button>
                    </form>
                    <form action="/voteContent" method="post">
                        <input type="hidden" name="upVote" value="false"/>
                        <input type="hidden" name="contentId" value={item.id}/>
                        <button type="submit">Downvote this!</button>
                    </form>
                </li>
                )
            })}
            
            </ul>
            </div>
        </Layout>
    </html>
)
    var html = renderHtml(structure);
    return html;
}
module.exports = {renderLogin: renderLogin, renderSignup: renderSignup, renderCreateContent: renderCreateContent, renderHomepage: renderHomepage}