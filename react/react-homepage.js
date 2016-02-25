var React = require('react');
var Nav = require('./react-nav');
var contentRow = require('./react-contentRow');

function Post(content, postNumber) {
  var vote;
  if (content.upvote === 1)
  vote = true;

  else if (content.upvote === 0)
  vote = false;

  var row = contentRow(content, vote, content.submitter, content.votescore);
  return (
    <li style={{"listStyle": "none"}} className="content-item" key={content.id}>
      <div className="numberedRow">
        <a>{postNumber}</a>
        {row}
      </div>
    </li>
  )
}

var tabs = ['hot', 'latest', 'top', 'controversial']

function getTablist(type) {
  return tabs.map(function(tab) {
    return {
      name: tab,
      url: '/sort/' + tab + '/0',
      selected: tab === type
    }
  });
}

function Pages(page, type) {
  var next = page + 1;
  var previous = page - 1;
  var nextlink = "/sort/" + type + "/" + next;
  var prevlink = "/sort/" + type + "/" + previous;
  if (page === 0)
  return (
    <section id="pagenav">
      <div className="button-wrapper">
        <a className="pagebutton tangerine" href={nextlink}>Next</a>
      </div>
    </section>
  );

  else return (
    <section id="pagenav">
      <div className="button-wrapper">
        <a className="pagebutton tangerine" href={prevlink}>Previous</a>
      </div>
      <div className="button-wrapper">
        <a className="pagebutton tangerine" href={nextlink}>Next</a>
      </div>
    </section>
  );
}

function HomePage(user, contents, type, page, pageLength) {
  var nav = Nav(user, getTablist(type));
  var posts = []
  for (var i = 0; i < contents.length; i++) {
    var pageNumber = page*pageLength + i + 1;
    posts.push(Post(contents[i], pageNumber));
  }
  var pages = Pages(page, type);
  return (
    <html>
    <head>
      <title>fuggedabouddit</title>
      <meta charSet="utf-8"/>
      <link href="/css/homepage.css" rel="stylesheet" type="text/css"/>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
      <script src="/jquery/logvote.js"></script>
      <script src="/jquery/popbox.js"></script>
    </head>
    <body>
      {nav}
      <main className="contents">
        <ol className="contents-list">
          {posts}
        </ol>
        <div className="sidebar">
          <a href="/CreateContent" className="contentButton">Submit Link</a>
        </div>
      </main>
      <footer id="pages">
        {pages}
      </footer>
    </body>
    </html>
  );
}

module.exports = HomePage;
