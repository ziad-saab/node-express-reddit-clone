var React = require('react');
var Nav = require('./react-nav');
var contentRow = require('./react-contentRow');

function renderComment(comment, commentScores) {
  var upvote = "/images/grey-upvote.png";
  var downvote = "/images/grey-downvote.png";
  var vote;
  if (comment.usercommentvotes.length > 0)
  vote = comment.usercommentvotes[0].upVote;
  if (vote === true) {
    upvote = "/images/green-upvote.png";
  } else if (vote === false){
    downvote = "/images/red-downvote.png";
  }
  var children = [];
  if (comment.children)
  var children = comment.children.map(function(child) {
    return renderComment(child, commentScores);
  });
  return (
    <div className="commentNest">
      <div className="commentRow" key={comment.id}>
        <div className="commentVotescore">
          <input className="commentUpvote" data-comment={comment.id} type="image" src={upvote}/>
          <input className="commentDownvote" data-comment={comment.id} type="image" src={downvote}/>
        </div>
        <div className="commentContent">
          <div className="commentMeta">
            <div className="submissionInfo">
              <a className="metatext">{commentScores[comment.id]} Post by {comment.user.username}</a>
              <a className="metatext">{comment.createdAt.toString()}</a>
            </div>
          </div>

            <table className="commentText">
              <tr>
                <td><a>{comment.text}</a></td>
              </tr>
            </table>
          <a className="metalink reply">reply</a>
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

  function Comments(user, submitter, content, comments, vote, votescore, commentScores){
    var nav;
    if (user)
    nav = Nav(user.username, []);
    else nav = Nav(undefined, []);

    var commentScoreHash = {};
    commentScores.forEach(function(commentScore) {
      commentScoreHash[commentScore.id] = commentScore.voteScore;
    })
    var contentHeader = contentRow(content, vote.upVote, submitter.username, votescore);

    var commentAction = "/comment/" + content.id;

    var comments = comments.map(function(comment) {
      return renderComment(comment, commentScoreHash);
    });

    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <link href="/css/comment.css" rel="stylesheet" type="text/css"/>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
          <script src="/jquery/reply.js"></script>
          <script src="/jquery/logvote.js"></script>
          <script src="/jquery/logcommentvote.js"></script>
          <script src="/jquery/popbox.js"></script>
        </head>
        <body>
          {nav}
          <main className="contents">
            <div className="pageBody">
              {contentHeader}
              <div className="replyBox" data-content={content.id} data-comment>
                <textarea className="replyTextBox" type="text"/>
                <a className="replySaveButton">save</a>
              </div>

              <div className="allComments">
                {comments}
              </div>
            </div>
            <div className="sidebar">
              <a href="/CreateContent" className="contentButton">Submit Link</a>
            </div>
          </main>
        </body>
      </html>
    );
  }

  module.exports = Comments;
