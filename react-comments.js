var React = require('react');
var Nav = require('./react-nav');

function renderComment(comment) {
  var upvote = "/grey-upvote.png";
  var downvote = "/grey-downvote.png";
  var children = comment.children.map(function(child) {
    return renderComment(child);
  });
return (
  <div className="commentNest">
    <div className="commentRow" key={comment.id}>
    <div className="commentVotescore">
      <input className="upvote" data-content={comment.id} type="image" src={upvote}/>
      <p className="votescore">0</p>
      <input className="downvote" data-content={comment.id} type="image" src={downvote}/>
    </div>
    <div className="commentContent">
      <a className="commentText">{comment.text}</a>
      <div className="commentMeta">
        <div className="submissionInfo">
          <a className="metatext">Post by {comment.user.username}</a>
          <a className="metatext">{comment.createdAt.toString()}</a>
        </div>
      </div>
    </div>
    </div>
  {children}
</div>
)};
function Comments(user, content, comments){
    var nav;
    if (user)
    nav = Nav(user.username, []);
    else nav = Nav(undefined, []);

    var commentAction = "/comment/" + content.id;

    var comments = comments.map(renderComment);

    return (
      <html>
      <head>
        <meta charSet="utf-8"/>
        <link href="/comment.css" rel="stylesheet" type="text/css"/>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
        <script src="/logvote.js"></script>
      </head>
      <body>
        {nav}
        <main className="contents">
        <section>
          <a className="contentpost" href={content.url}>{content.title}</a>
          <ul className="contents-list">
            <span id="contentList">
              <form action={commentAction} method="post">
                <label htmlFor="comment"><span>Comment:</span><input type="text" className="input-field" name="comment" value="" maxLength="255"/></label>
                <label><span>&nbsp;</span><input type="submit" value="Reply" /></label>
              </form>

              <div className="allComments">
              {comments}
              </div>

            </span>
          </ul>
          </section>
          <div className="sidebar">
            <a href="/CreateContent" className="contentButton">Submit Link</a>
          </div>
        </main>
      </body>
      </html>
    );
}

module.exports = Comments;
