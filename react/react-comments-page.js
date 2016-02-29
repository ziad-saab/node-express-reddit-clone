var React = require('react');
var Nav = require('./react-nav');
var contentRow = require('./react-contentRow');
var renderComment = require('./react-comment').renderComment;
var sortComment = require('./react-comment').sortComment;

  function Comments(user, submitter, content, comments, vote, votescore, commentScores, rootComment){
    var nav;
    if (user)
    nav = Nav({user: user.username});
    else nav = Nav({});

    var commentScoreHash = {};
    commentScores.forEach(function(commentScore) {
      commentScoreHash[commentScore.id] = commentScore.voteScore;
    })
    var contentHeader = contentRow(content, vote.upVote, submitter.username, votescore);

    var commentAction = "/comment/" + content.id;

    var comments = sortComment(comments, commentScoreHash).map(function(comment) {
      return renderComment(comment, commentScoreHash, rootComment);
    });

    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <link href="/css/comments-page.css" rel="stylesheet" type="text/css"/>
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
          <script src="/compiled-scripts/compiled.js"></script>
        </body>
      </html>
    );
  }

  module.exports = Comments;
