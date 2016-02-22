function renderComment(comment, n) {
    var upvote = "/tinygreyupvote.ico";
    var downvote = "/tinygreydownvote.ico";
    var margins = "margin-left: 40px;";
    
    if (comment.children) {
        var comments = comment.children.forEach(function(child) {
          renderComment(child, n + 10);
        });
    }
    
    return (
      <div class="commentDepth">
      <li style="list-style: none;" class="content-item">
        <hr></hr>
        <table>
          <tr>
            <td><a><img src={upvote}></img></a></td>
            <td><p class="createdby">Post by <span class="usercreater">{comment.user.username}</span></p></td>
          </tr>
          <tr>
            <td><p class="votescore"></p></td>
            <td><a class="contentpost">{comment.text}</a></td>
          </tr>
          <tr>
            <td><a><img src={downvote}></img></a></td>
            <td><a class="comments" href="">Direct Link</a></td>
          </tr>
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
      <h4 id="welcomeuser">Welcome <span id="user">{user}</span></h4>
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
    var comments = comments.forEach(renderComment, 0);
    
    return (
        <html>
            <head>
                <meta charset="utf-8"/>
                <link href="/comment.css" rel="stylesheet" type="text/css"/>
            </head>
            <body>
              
              <nav>
                {header}
              </nav>
              
              <main>
              <div id="contents">
                <a id="heading" href={content.url}>{content.title}</a>
                <ul class="contents-list">
                  <span id="contentList">
                    <form action={commentAction} method="post">
                      <label for="comment"><span>Comment:</span><input type="text" class="input-field" name="comment" value="" maxlength="255"/></label>
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