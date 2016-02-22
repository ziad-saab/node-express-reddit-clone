
var React = require('react');

function Post(data) {
  return (
    <div>
      <h2>
        <a href={data.url}>{data.title}</a>
      </h2>
    </div>
  )
}

function HomePage(user, content, type, page) {
/*
  var postsList = <a></a>;
  var header;
  if (user)
  header = (<h4 id="welcomeuser">Welcome <span id="user">{user}</span></h4>
  <a href=/Logout class="link">Logout</a>
  <a href=/CreateContent class="link">Create Content</a>);

  else header = (
    <a href=/SignUp class="link">Sign Up</a>
    <a href=/Login class="link">Login</a>);

  var pages = <a></a>

  var pages;
  var next = page + 1;
  var previous = page - 1;
  if (page === 0)
  pages = <li><a href="/" + {type} +"/" + {next}>Next»</a></li>;

  else pages = (
    <li><a href="/" + {type} +"/" + {previous}>«Previous</a></li>
    <li><a href="/" + {type} + "/" + {next}>Next»</a></li>
  );
*/
  return (
    <body>
      <nav>
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
            </span>
        </ul>
      </main>

      <footer id="pages">
        <ul className="pagination">
        </ul>
      </footer>
    </body>
  )
}

module.exports = HomePage;
