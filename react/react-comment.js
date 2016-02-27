var React = require('react');
var Moment = require('moment');

function createParentLink(comment) {
  if (!comment.parentId)
  return '';
  else {
    var parentLink = `/link/${comment.contentId}/comments/${comment.parentId}`
    return  (<a className="metalink" href={parentLink}>parent</a>)
  }
}

function sortComment(comments, commentScores) {
  return comments.sort(function(c1, c2) {
    if (commentScores[c1.id] === commentScores[c2.id])
    return c1.createdAt < c2.createdAt;

    else return commentScores[c1.id] < commentScores[c2.id];
  });
}

function renderComment(comment, commentScores, rootComment) {

  var rootClass = "commentNest";
  if (rootComment)
  rootClass = "rootNest";
  var upvote = "/images/grey-upvote.png";
  var downvote = "/images/grey-downvote.png";
  var vote = null;
  try {
    if (comment.usercommentvotes.length > 0)
    vote = comment.usercommentvotes[0].upVote;
  } catch (e) {}

  if (vote === true) {
    upvote = "/images/green-upvote.png";
  } else if (vote === false){
    downvote = "/images/red-downvote.png";
  }
  var children = [];

  if (comment.children)
  var children = sortComment(comment.children, commentScores).map(function(child) {
    return renderComment(child, commentScores, false);
  });
  var pointString = 'points';
  if(commentScores[comment.id] === 1)
  var pointString = 'point';
  var permalink = `/link/${comment.contentId}/comments/${comment.id}`;
  var parentLink = createParentLink(comment);
  var submitterLink = `/user/${comment.user.username}`;
  var continueReading = ``;
  if (comment.user.the_end)
  continueReading = <a className="continueReading" href={permalink}>continue this thread</a>;
  return (
    <div className={rootClass}>
      <div className="commentRow" key={comment.id}>
        <div className="commentVotescore">
          <input className="commentUpvote" data-comment={comment.id} type="image" src={upvote}/>
          <input className="commentDownvote" data-comment={comment.id} type="image" src={downvote}/>
        </div>
        <div className="commentContent">
          <div className="commentMeta">
            <div className="submissionInfo">
              <a className="userLink" href={submitterLink}>{comment.user.username}</a>
              <a className="metatext"> <span className="commentScore">{commentScores[comment.id]}</span> <span className="pointString">{pointString}</span> {Moment(comment.createdAt).fromNow()}</a>
            </div>
          </div>

          <table className="commentText">
            <tr>
              <td><a>{comment.text}</a></td>
            </tr>
          </table>
          <div className="lowerLinks">
            <a className="metalink" href={permalink}>permalink</a>
            {parentLink}
            <a className="metalink reply">reply</a>
          </div>
          {continueReading}
        </div>
      </div>

      <div className="hiddenReplyBox" data-content={comment.contentId} data-comment={comment.id}>
        <textarea className="replyTextBox" type="text"/>
        <div className="commentButtons">
          <a className="replySaveButton">save</a>
          <a className="replyCancelButton">cancel</a>
        </div>
      </div>
      {children}
    </div>
  )};

  module.exports = {
    renderComment: renderComment,
    sortComment: sortComment
  };
