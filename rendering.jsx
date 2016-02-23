var React = require('react');
var ReactDOMServer = require('react-dom/server');



function renderHtml(jsxStructure) {
  var outputHtml = ReactDOMServer.renderToStaticMarkup(jsxStructure);

  return '<!doctype html>' + outputHtml;
}


function renderHomePage(data) {

  var postsList = data.posts.map(
    function(item) {
      return <li key={item.id}><Post title={item.title} url={item.url}/></li>;
    }
  );

  return (
    <div>
      <h1>Reddit clone!</h1>
      <ul>
        {postsList}
      </ul>
    </div>
  );

}

function renderLogin(data) {
  // create the HTML structure with interpolations
  var structure = (
    <html>
      <head>
        <title>Login!</title>
      </head>
      <body>
        <h1>Log in</h1>
        <form action="/login" method="post">
          {data.error && <div>{data.error}</div>}
          <div><input type="text" name="username"/></div>
          <div><input type="text" name="password"/></div>
          <div><button type="submit">Login!</button></div>
        </form>
      </body>
    </html>
  );
  
  // return the html
  var html = renderHtml(structure);
  return html;
}


function renderSignup(data) {
  // create the HTML structure with interpolations
  var structure = (
    <html>
      <head>
        <title>Sign up!</title>
      </head>
      <body>
        <h1>Sign up</h1>
        <form action="/signup" method="post">
          {data.error && <div>{data.error}</div>}
          <div><input type="text" name="username"/></div>
          <div><input type="text" name="password"/></div>
          <div><button type="submit">Sign up!</button></div>
        </form>
      </body>
    </html>
  );
  
  // return the html
  var html = renderHtml(structure);
  return html;
}

function renderCreatePost(data) {
  // create the HTML structure with interpolations
  var structure = (
    <html>
      <head>
        <title>Create a Post!</title>
      </head>
      <body>
        <h1>Create a Post</h1>
        <form action="/createPost" method="post">
          {data.error && <div>{data.error}</div>}
          <div><input type="text" name="title"/></div>
          <div><input type="text" name="url"/></div>
          <div><button type="submit">Create!</button></div>
        </form>
      </body>
    </html>
  );
  
  // return the html
  var html = renderHtml(structure);
  return html;
}

module.exports = {
    renderLogin: renderLogin,
    renderSignup: renderSignup,
    renderCreatePost: renderCreatePost,
    renderHomeage: renderHomePage
}