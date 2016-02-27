var React = require('react');
var Nav = require('./react-nav');
var renderComment = require('./react-comment').renderComment;
var renderComment = require('./react-comment').renderComment;

  function UserPage(user, comments, commentScores){
    console.log(comments);
    var nav;
    if (user)
    nav = Nav(user.username, []);
    else nav = Nav(undefined, []);
    var commentScoreHash = {};
    commentScores.forEach(function(commentScore) {
      commentScoreHash[commentScore.id] = commentScore.voteScore;
    })
    var rendercomments = []
    var rendercomments = comments.map(function(comment) {
      return renderComment(comment, commentScoreHash, false);
    });

    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <link href="/css/comments-page.css" rel="stylesheet" type="text/css"/>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.2/moment.min.js"></script>
          <script src="/jquery/reply.js"></script>
          <script src="/jquery/logcommentvote.js"></script>
          <script src="/jquery/popbox.js"></script>
        </head>
        <body>
          {nav}
          <main className="contents">
            <div className="pageBody">

              <div className="allComments">
                {rendercomments}
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

  module.exports = UserPage;
