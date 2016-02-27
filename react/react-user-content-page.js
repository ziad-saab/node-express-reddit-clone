var React = require('react');
var Nav = require('./react-nav');
var contentRow = require('./react-contentRow');


function Post(content) {
  var vote;
  if (content.upvote === 1)
  vote = true;

  else if (content.upvote === 0)
  vote = false;

  var row = contentRow(content, vote, content.submitter, content.votescore);
  return (
    <li style={{"listStyle": "none"}} className="content-item" key={content.id}>
        {row}
    </li>
  )
}

function Pages(user, page, pageLength, numEntries) {
  var next = page + 1;
  var previous = page - 1;
  var nextlink = "/user/" + user + "/submissions/" + next;
  var prevlink = "/user/" + user + "/submissions/" + previous;
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
var tabs = ['submissions', 'comments']

function getTablist(type, username) {
  return tabs.map(function(tab) {
    return {
      name: tab,
      url: '/user/' + username + '/' + tab + '/0',
      selected: tab === type
    }
  });
}

  function UserSubmissionPage(user, userPage, contents, page, pageLength) {
    var tablist = getTablist('submissions', userPage);
    var nav = Nav({user: user, tablist: tablist, pageTitle: userPage});

    var posts = contents.map(Post);
    var pages = Pages(userPage, page, pageLength, contents.length)
    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <link href="/css/user-page.css" rel="stylesheet" type="text/css"/>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.2/moment.min.js"></script>
          <script src="/jquery/logvote.js"></script>
          <script src="/jquery/popbox.js"></script>
        </head>
        <body>
          {nav}
          <main className="contents">
            <div className="pageBody">
              {posts}
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

  module.exports = UserSubmissionPage;
