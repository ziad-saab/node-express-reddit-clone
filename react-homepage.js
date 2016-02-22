
var React = require('react');

function Post(content) {
    var upvote = "/tinygreyupvote.ico";
    var upvotelink = "/upvote/" + content.id;
    var downvote = "/tinygreydownvote.ico";
    var downvotelink = "/downvote/" + content.id;
    var comments = "/link/" + content.id + "/comments";
    if (content.upvote === 1) {
      upvote = "/tinyredupvote.ico";
    } else if (content.upvote === 0){
      downvote = "/tinybluedownvote.ico";
    }
  return (
      <li style={{"listStyle": "none"}} className="content-item" key={content.id}>
      <div className="contentRow">
      <div className="contentVotescore">
        <form action={upvotelink} method="post">
          <input type="image" src={upvote}/>
        </form>
        <p className="votescore">{content.votescore}</p>
        <form action={downvotelink} method="post">
          <input type="image" src={downvote}/>
        </form>
      </div>
      <div className="contentContent">
        <div className="contentTitle">
          <a className="contentpost" href={content.url}>{content.title}</a>
        </div>
        <div className="contentMetaData">
          <a className="metatext">Post by {content.submitter}</a>
          <a className="metatext">{content.createdAt.toString()}</a>
          <a className="metatext" href={comments}>Comments</a>
        </div>
      </div>
      </div>
    </li>
  )
}

function HomePage(user, contents, type, page) {

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
  var posts = contents.map(Post);
  var pages;
  var next = page + 1;
  var previous = page - 1;
  var nextlink = "/sort/" + type + "/" + next;
  var prevlink = "/sort/" + type + "/" + previous;
  if (page === 0)
  pages = <li><a href={nextlink}>Next»</a></li>;

  else pages = (
    <div>
      <li><a href={prevlink}>«Previous</a></li>
      <li><a href={nextlink}>Next»</a></li>
    </div>
  );
  return (

    <html>
    <head>
      <meta charSet="utf-8"/>
      <link href="/homepage.css" rel="stylesheet" type="text/css"/>
    </head>
    <body>
      <nav>
      {header}
        <div id="orderbylinks">
          <a href="/sort/hot" className="getlink">Hot</a>
          <a href="/sort/controversial" className="getlink">Controversial</a>
          <a href="/sort/top" className="getlink">Top</a>
          <a href="/sort/latest" className="getlink">Latest</a>
        </div>
      </nav>

      <main id="contents">
        <header>
          <h1 id="heading">List of contents</h1>
        </header>
        <ul className="contents-list">
          <span id="contentList">
            <hr/>
            {posts}
            </span>
        </ul>
      </main>

      <footer id="pages">
        <ul className="pagination">
        {pages}
        </ul>
      </footer>
    </body>
    </html>
  )
}

module.exports = HomePage;
