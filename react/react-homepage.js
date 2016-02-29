var React = require('react');
var Nav = require('./react-nav');
var contentRow = require('./react-contentRow');

function Post(content, postNumber, width) {
  var vote;
  if (content.upvote === 1)
  vote = true;

  else if (content.upvote === 0)
  vote = false;

  var row = contentRow(content, vote, content.submitter, content.votescore);
  return (
    <li style={{"listStyle": "none"}} className="content-item" key={content.id}>
      <div className="numberedRow">
        <div className="postNumber" style={{"minWidth": width}}>
          <a>{postNumber}</a>
        </div>
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

function longerScoreString(content1, content2) {
  if (content1.votescore > content2.votescore)
  return content1;
  else return content2;
}
function longestScoreString(contents) {
  return longerScoreString.apply(null, contents);
}

function Pages(page, type, pageLength, numEntries) {
  var next = page + 1;
  var previous = page - 1;
  var nextlink = "/sort/" + type + "/" + next;
  var prevlink = "/sort/" + type + "/" + previous;
  if (page === 0 && pageLength > numEntries)
  return (
    <section id="pagenav">
      <div className="button-wrapper">
      </div>
    </section>
  );
  if (page === 0)
  return (
    <section id="pagenav">
      <div className="button-wrapper">
        <a className="pagebutton tangerine" href={nextlink}>Next</a>
      </div>
    </section>
  );
  else if (pageLength > numEntries)
  return (
    <section id="pagenav">
      <div className="button-wrapper">
        <a className="pagebutton tangerine" href={prevlink}>Previous</a>
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
  var nav = Nav({user: user, tablist: getTablist(type)});

  var width = (((page+1)*pageLength).toString().length*0.7).toString() + 'em';
  if (contents.length > 0)
  var scoreWidth = (longestScoreString(contents).votescore.length*0.7).toString() + 'em';
  var posts = []
  for (var i = 0; i < contents.length; i++) {
    var pageNumber = page*pageLength + i + 1;
    posts.push(Post(contents[i], pageNumber, width));
  }
  var pages = Pages(page, type, pageLength, posts.length);
  return (
    <html>
    <head>
      <title>fuggedabouddit</title>
      <meta charSet="utf-8"/>
      <link href="/css/homepage.css" rel="stylesheet" type="text/css"/>
      <link href="/css/style.css" rel="stylesheet" type="text/css"/>
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
      <script src="/compiled-scripts/compiled.js"></script>
    </body>
    </html>
  );
}

module.exports = HomePage;
