var React = require('react');
var Nav = require('./react-nav');

function page404(username) {
  var nav = Nav({user: username, pageTitle: 404});
  return (
    <html>
    <head>
      <title>fuggedabouddit</title>
      <meta charSet="utf-8"/>
      <link href="/css/nav.css" rel="stylesheet" type="text/css"/>
    </head>
    <body>
      {nav}
      <main className="contents">
        <h1>404, GET OUTTA HERE!</h1>
      </main>
    </body>
    </html>
  );
}

module.exports = page404;
