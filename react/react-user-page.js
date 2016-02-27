var React = require('react');
var Nav = require('./react-nav');
var renderComment = require('./react-comment').renderComment;

function Pages(user, page, pageLength, numEntries) {
  var next = page + 1;
  var previous = page - 1;
  var nextlink = "/user/" + user + "/" + next;
  var prevlink = "/user/" + user + "/" + previous;
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

  function UserPage(user, userPage, comments, commentScores, page, pageLength) {
    var nav;
    if (user)
    nav = Nav({user: user.username, pageTitle: userPage});
    else nav = Nav({pageTitle: userPage});
    var commentScoreHash = {};
    commentScores.forEach(function(commentScore) {
      commentScoreHash[commentScore.id] = commentScore.voteScore;
    })
    var rendercomments = []
    var rendercomments = comments.map(function(comment) {
      return renderComment(comment, commentScoreHash, false);
    });
    var pages = Pages(userPage, page, pageLength, comments.length)
    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <link href="/css/user-page.css" rel="stylesheet" type="text/css"/>
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
          <footer>
            {pages}
          </footer>
        </body>
      </html>
    );
  }

  module.exports = UserPage;
