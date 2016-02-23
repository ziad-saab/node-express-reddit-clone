
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
        <input className="upvote" data-content={content.id} type="image" src={upvote}/>
        <p className="votescore">{content.votescore}</p>
        <input className="downvote" data-content={content.id} type="image" src={downvote}/>
      </div>
      <div className="contentContent">
        <div className="contentTitle">
          <a className="contentpost" href={content.url}>{content.title}</a>
        </div>
        <div className="contentMetaData">
          <div className="submissionInfo">
            <a className="metatext">Post by {content.submitter}</a>
            <a className="metatext">{content.createdAt.toString()}</a>
          </div>
          <a className="metalink" href={comments}>Comments</a>
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
  pages = (
    <section id="pagenav">
      <div className="button-wrapper">
  				<a className="pagebutton tangerine" href={nextlink}>Next</a>
  		</div>
  	</section>
    );

  else pages = (
    <section id="pagenav">
      <div className="button-wrapper">
  				<a className="pagebutton tangerine" href={prevlink}>Previous</a>
  		</div>
  		<div className="button-wrapper">
  				<a className="pagebutton tangerine" href={nextlink}>Next</a>
  		</div>
		</section>
  );

  return (

    <html>
    <head>
      <meta charSet="utf-8"/>
      <link href="/homepage.css" rel="stylesheet" type="text/css"/>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
      <script src="/logvote.js"></script>
    </head>
    <body>
      {nav}
      <main className="contents">
        <ul className="contents-list">
          <span id="contentList">
            {posts}
            </span>
        </ul>
        <div className="sidebar">
          <a href="/CreateContent" className="contentButton">Submit Link</a>
        </div>
      </main>

      <footer id="pages">
        {pages}
      </footer>
    </body>
    </html>
  )
}

module.exports = HomePage;
