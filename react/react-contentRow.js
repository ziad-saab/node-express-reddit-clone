var React = require('react');

function contentRow(content, vote, submitter, votescore) {
  var upvote = "/images/grey-upvote.png";
  var upvotelink = "/upvote/" + content.id;
  var downvote = "/images/grey-downvote.png";
  var downvotelink = "/downvote/" + content.id;
  var comments = "/link/" + content.id + "/comments";
  if (vote === true) {
    upvote = "/images/green-upvote.png";
  } else if (vote === false){
    downvote = "/images/red-downvote.png";
  }
  return (
    <div className="contentRow">
      <div className="contentVotescore">
        <input className="upvote" data-content={content.id} type="image" src={upvote}/>
        <p className="votescore">{votescore}</p>
        <input className="downvote" data-content={content.id} type="image" src={downvote}/>
      </div>
      <div className="contentContent">
        <div className="contentTitle">
          <a className="contentpost" href={content.url}>{content.title}</a>
        </div>
        <div className="contentMetaData">
          <div className="submissionInfo">
            <a className="metatext">Post by {submitter}</a>
            <a className="metatext">{content.createdAt.toString()}</a>
          </div>
          <a className="metalink" href={comments}>Comments</a>
        </div>
      </div>
    </div>
  )
};

module.exports = contentRow;
