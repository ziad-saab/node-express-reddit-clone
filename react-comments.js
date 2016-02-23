var React = require('react');

function renderComment(comment, n) {
    var upvote = "/tinygreyupvote.ico";
    var downvote = "/tinygreydownvote.ico";
    var margins = "margin-left: 40px;";
    var comments;
    if (comment.children) {
        comments = comment.children.map(function(child) {
          return renderComment(child, n + 10);
        });
    }

    return (
      <div className="commentDepth" key={comment.id}>
      <li style={{"listStyle": "none"}} className="content-item">
        <hr></hr>
        <table>
        <tbody>
          <tr>
            <td><a><img src={upvote}></img></a></td>
            <td><p className="createdby">Post by <span className="usercreater">{comment.user.username}</span></p></td>
          </tr>
          <tr>
            <td><p className="votescore"></p></td>
            <td><a className="contentpost">{comment.text}</a></td>
          </tr>
          <tr>
            <td><a><img src={downvote}></img></a></td>
            <td><a className="comments" href="">Direct Link</a></td>
          </tr>
          </tbody>
        </table>
      </li>
      <hr></hr>
      {comments}
    </div>
    );
}

function Comments(user, content, comments){
    var header;
    if (user)
    header = (
    <div>
      <h4 id="welcomeuser">Welcome <span id="user">{user.username}</span></h4>
      <a href="/Logout" className="link">Logout</a>
      <a href="/CreateContent" className="link">Create Content</a>
    </div>);

    else header = (
    <div>
      <a href="/SignUp" className="link">Sign Up</a>
      <a href="/Login" className="link">Login</a>
    </div>
    );

    var commentAction = "/comment/" + content.id;

    var comments = comments.map(renderComment);

    return (
        <html>
            <head>
                <meta charSet="utf-8"/>
                <link href="/comment.css" rel="stylesheet" type="text/css"/>
            </head>
            <body>

              <nav>
                {header}
              </nav>

              <main>
              <div id="contents">
                <a id="heading" href={content.url}>{content.title}</a>
                <ul className="contents-list">
                  <span id="contentList">
                    <form action={commentAction} method="post">
                      <label htmlFor="comment"><span>Comment:</span><input type="text" className="input-field" name="comment" value="" maxLength="255"/></label>
                      <label><span>&nbsp;</span><input type="submit" value="Reply" /></label>
                    </form>

                    <article>
                    {comments}
                    </article>

                  </span>
                </ul>
              </div>
              </main>

            </body>
        </html>
    );
}

module.exports = Comments;
