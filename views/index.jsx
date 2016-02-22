var React = require('react');

var HelloMessage = React.createClass({
  render: function() {
    return <html>
        <head>
            <meta charset="utf-8"/>
            <link href="/homepage.css" rel="stylesheet" type="text/css"/>
        </head>
        <body>
            <a href="/SignUp" class="link">Sign Up</a>
            <a href="/Login" class="link">Login</a>

          <div id="orderbylinks">
            <a href="/hot" class="getlink">Hot</a>
            <a href="/controversial" class="getlink">Controversial</a>
            <a href="/top" class="getlink">Top</a>
            <a href="/latest" class="getlink">Latest</a>
          </div>

          <div id="contents">
          </div>
        </body>
    </html>;
  }
});

module.exports = HelloMessage;
