var React = require('react');
var ReactDOMServer = require('react-dom/server');
var moment = require('moment')


function renderHtml(jsxStructure) {
  var outputHtml = ReactDOMServer.renderToStaticMarkup(jsxStructure);

  return '<!doctype html>' + outputHtml;
}
function Layout(data) {
  return (
    <html>
        <head>
            <link rel="stylesheet" type="text/css" href="/style.css"></link>
            <link href='https://fonts.googleapis.com/css?family=Raleway:400,700|Indie+Flower' rel='stylesheet' type='text/css'></link>
            <link rel="stylesheet" href="/font-awesome-4.5.0/css/font-awesome.min.css" type='text/css'></link>
                <title>{data.title}</title>
        </head>
        <body>
        <header><h1 className='banner'>Sounding board</h1></header>
            <nav>
                <ul className="mainNav">
                    <li><a href="/">Home</a></li>
                    <li><a href="/createContent">Share</a></li>
                    <li><a href="/login">Login</a></li>
                </ul>
            </nav>
                {data.children}
            <script type = "text/javascript" src="https://code.jquery.com/jquery-1.12.1.js"></script>
            <script type = "text/javascript" src= '/app.js'></script>
        </body>
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
            <button type="submit"><i className="fa fa-sign-in"></i></button>
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
            <button type="submit"><i className="fa fa-sign-in"></i></button>
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
                <input id="url" type="text" name="url" placeholder="Enter a URL"/>
            </div>
            <div>
                <input id= 'postTitle' type="text" name="title" placeholder="Enter a Post Title"/>
            </div>
            <input type='button' id="suggestTitle" value ='Suggest title'/>
            <div>
            <button type="submit"><i className="fa fa-sign-in"></i></button>
            </div>
            </form>
        </Layout>
        );
    var html = renderHtml(structure);
    return html;
}

function renderHomepage(data) {
    var structure = (
    <Layout>
        <nav>
            <ul className="sortNav">
                <li><a href="/sort/new">New</a></li>
                <li><a href="/sort/top">Top</a></li>
                <li><a href="/sort/hot">Hot</a></li>
            </ul>
        </nav>
        <div id="contents">
        <h1 className="table-name">Posts</h1>
        <ul className="contents-list">
        
         {data.map(function(item) {
            return (
            <li key={item.id} className="content-item">
                <div className="full-content">
                    <h2 className="content-item__title">
                        <a href={item.url}>{item.title}</a>
                    </h2>
                    <div className="content-details">
                        <p className="content-item__user"> {item.user.username}</p>
                        <p className="content-item__time"> {moment(item.createdAt).format('MMMM Do YYYY')}</p>
                    </div>
                </div>
                <div className="full-form">
                    <form className="form" action="/voteContent" method="post">
                        <input type="hidden" name="upVote" value="true"/>
                        <input type="hidden" name="contentId" value={item.id}/>
                        <button type="submit"><i className="fa fa-thumbs-o-up"></i></button>
                    </form>
                    <p className="form vote-value">{item.dataValues.voteScore ? item.dataValues.voteScore : 0}</p>
                    <form className="form" action="/voteContent" method="post">
                        <input type="hidden" name="upVote" value="false"/>
                        <input type="hidden" name="contentId" value={item.id}/>
                        <button type="submit"><i className="fa fa-thumbs-o-down"></i></button>
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