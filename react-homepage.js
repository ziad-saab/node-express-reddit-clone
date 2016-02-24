var React = require('react');
var Nav = require('./react-nav');

function Post(content) {
    var upvote = "/images/grey-upvote.png";
    var upvotelink = "/upvote/" + content.id;
    var downvote = "/images/grey-downvote.png";
    var downvotelink = "/downvote/" + content.id;
    var comments = "/link/" + content.id + "/comments";
    if (content.upvote === 1) {
      upvote = "/images/green-upvote.png";
    } else if (content.upvote === 0){
      downvote = "/images/red-downvote.png";
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

function Posts(contents) {
  var posts = contents.map(Post);
  return (
    <div>
      {posts}
    </div>
  );
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
function HomeNav(user, type) {
  return Nav(user, getTablist(type));
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

module.exports = {
  Posts: Posts,
  HomeNav: HomeNav,
  Pages: Pages
};
