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
      <div className="numberedRow">
        <a>1</a>
        {row}
      </div>
    </li>
  )
}

var tabs = ['hot', 'latest', 'top', 'controversial']

function getTablist(type) {
  return tabs.map(function(tab) {
    return {
      name: tab,
      url: '/sort/' + tab + '/0',
      selected: tab === type
    }
  });
}

function Pages(page, type) {
  var next = page + 1;
  var previous = page - 1;
  var nextlink = "/sort/" + type + "/" + next;
  var prevlink = "/sort/" + type + "/" + previous;
  if (page === 0)
  return (
    <section id="pagenav">
      <div className="button-wrapper">
        <a className="pagebutton tangerine" href={nextlink}>Next</a>
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

function HomePage(user, contents, type, page) {
  var nav = Nav(user, getTablist(type));
  var posts = contents.map(Post);
  var pages = Pages(page, type);
  return (
    <html>
    <head>
      <title>fuggedabouddit</title>
      <meta charSet="utf-8"/>
      <link href="/css/homepage.css" rel="stylesheet" type="text/css"/>
      <link href="/css/style.css" rel="stylesheet" type="text/css"/>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
      <script src="/jquery/logvote.js"></script>
      <script src="/jquery/popbox.js"></script>
    </head>
    <body>
      {nav}
      <main className="contents">
        <ol className="contents-list">
          {posts}
        </ol>
        <div className="sidebar">
          <a href="/CreateContent" className="contentButton">Submit Link</a>
        </div>
      </main>

<<<<<<< HEAD
=======
      <div className="popbox signupbox">
        <a className="close"><img src="/images/orange-close-25.png" className="btn_close" title="Close Window" alt="Close"/></a>
        <div className='form'>
          <div className='formheading'>Sign Up!</div>
          <form action="/SignUp" method="post">
            <label htmlFor="username"><span>Username <span className="required">*</span></span><input type="text" className="input-field" name="username" value="" maxLength="20"/></label>
            <label htmlFor="email"><span>Email </span><input type="text" className="input-field" name="email" value="" maxLength="50"/></label>
            <label htmlFor="password"><span>Password <span className="required">*</span></span><input type="password" className="input-field" name="password" maxLength="50"/></label>
            <label htmlFor="confirmpassword"><span>Confirm Password <span className="required">*</span></span><input type="password" className="input-field" name="confirmpassword" maxLength="50"/></label>
            <label><span>&nbsp;</span><input type="submit" value="Sign Up" /></label>
          </form>
        </div>
      </div>

       <div className="popbox loginbox">
          <a className="close"><img src="/images/orange-close.png" className="btn_close" title="Close Window" alt="Close"/></a>
          <div className='form'>
            <div className='formheading'>Login</div>
            <form action="/Login" method="post">
              <label htmlFor="username"><span>Username <span className="required">*</span></span><input type="text" className="input-field" name="username" value="" maxLength="20"/></label>
              <label htmlFor="password"><span>Password <span className="required">*</span></span><input type="password" className="input-field" name="password" value="" maxLength="50"/></label>
              <label><span>&nbsp;</span><input type="submit" value="Login" /></label>
            </form>
        </div>
      </div>

>>>>>>> 5e4b92dc23bfc059c11a443667f34aa88e95a122
      <footer id="pages">
        {pages}
      </footer>
    </body>
    </html>
  );
}

module.exports = HomePage;
