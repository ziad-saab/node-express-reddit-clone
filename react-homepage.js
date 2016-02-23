
var React = require('react');
var Nav = require('./react-nav');

function Post(content) {
    var upvote = "/grey-upvote.png";
    var upvotelink = "/upvote/" + content.id;
    var downvote = "/grey-downvote.png";
    var downvotelink = "/downvote/" + content.id;
    var comments = "/link/" + content.id + "/comments";
    if (content.upvote === 1) {
      upvote = "/green-upvote.png";
    } else if (content.upvote === 0){
      downvote = "/red-downvote.png";
    }
  return (
      <li style={{"listStyle": "none"}} className="content-item" key={content.id}>
      <div className="contentRow">
      <div className="contentVotescore">
        <form action={upvotelink} method="post">
          <input type="image" src={upvote}/>
        </form>
        <p className="votescore">{content.votescore}</p>
        <form action={downvotelink} method="post">
          <input type="image" src={downvote}/>
        </form>
      </div>
      <div className="contentContent">
        <div className="contentTitle">
          <a className="contentpost" href={content.url}>{content.title}</a>
        </div>
        <div className="contentMetaData">
          <a className="metatext">Post by {content.submitter}</a>
          <a className="metatext">{content.createdAt.toString()}</a>
          <a className="metatext" href={comments}>Comments</a>
        </div>
      </div>
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

function HomePage(user, contents, type, page) {

  var nav = Nav(user, getTablist(type));
  var posts = contents.map(Post);
  var pages;
  var next = page + 1;
  var previous = page - 1;
  var nextlink = "/sort/" + type + "/" + next;
  var prevlink = "/sort/" + type + "/" + previous;
  if (page === 0)
  pages = <li><a href={nextlink}>Next»</a></li>;

  else pages = (
    <div>
      <li><a href={prevlink}>«Previous</a></li>
      <li><a href={nextlink}>Next»</a></li>
    </div>
  );
  return (

    <html>
    <head>
      <meta charSet="utf-8"/>
      <link href="/homepage.css" rel="stylesheet" type="text/css"/>
    </head>
    <body>
      {nav}
      <main id="contents">
        <ul className="contents-list">
          <span id="contentList">
            {posts}
            </span>
        </ul>
      </main>

      <footer id="pages">
        <ul className="pagination">
        {pages}
        </ul>
      </footer>
    </body>
    </html>
  )
}

module.exports = HomePage;
