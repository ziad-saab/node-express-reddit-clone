var React = require('react');
var Nav = require('./react-nav');
var contentRow = require('./react-contentRow');

function renderComment(comment) {
  var upvote = "/images/grey-upvote.png";
  var downvote = "/images/grey-downvote.png";
  var children = [];
  if (comment.children)
  var children = comment.children.map(function(child) {
    return renderComment(child);
  });
  return (
    <div className="commentNest">
      <div className="commentRow" key={comment.id}>
        <div className="commentVotescore">
          <input className="commentUpvote" data-content={comment.id} type="image" src={upvote}/>
          <p className="votescore">0</p>
          <input className="commentDownvote" data-content={comment.id} type="image" src={downvote}/>
        </div>
        <div className="commentContent">
          <a className="commentText">{comment.text}</a>
          <div className="commentMeta">
            <div className="submissionInfo">
              <a className="metatext">Post by {comment.user.username}</a>
              <a className="metatext">{comment.createdAt.toString()}</a>
              <a className="metalink reply">reply</a>
            </div>
          </div>
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
  
  function Comments(user, submitter, content, comments, vote, votescore){
    var nav;
    if (user)
    nav = Nav(user.username, []);
    else nav = Nav(undefined, []);

    var contentHeader = contentRow(content, vote.upVote, submitter.username, votescore);

    var commentAction = "/comment/" + content.id;

    var comments = comments.map(renderComment);

    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <link href="/css/comment.css" rel="stylesheet" type="text/css"/>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
          <script src="/jquery/reply.js"></script>
          <script src="/jquery/logvote.js"></script>
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
