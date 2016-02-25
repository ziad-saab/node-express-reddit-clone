var React = require('react');
var Nav = require('./react-nav');

function Post(content) {
  var upvote = "/images/grey-upvote.png";
  var upvotelink = "/upvote/" + content.id;
  var downvote = "/images/grey-downvote.png";
  var downvotelink = "/downvote/" + content.id;
  var comments = "/link/" + content.id + "/comments";
  if (content.upvote === 1) {
    upvote = "/images/green-upvote.png";
  } else if (content.upvote === 0){
    downvote = "/images/red-downvote.png";
  }
  return (
    <li style={{"listStyle": "none"}} className="content-item" key={content.id}>
      <div className="contentRow">
        <div className="contentVotescore">
          <input className="upvote" data-content={content.id} type="image" src={upvote}/>
          <p className="votescore">{content.votescore}</p>
          <input className="downvote" data-content={content.id} type="image" src={downvote}/>
        </div>
        <div className="contentContent">
          <div className="contentTitle">
            <a className="contentpost" href={content.url}>{content.title}</a>
          </div>
          <div className="contentMetaData">
            <div className="submissionInfo">
              <a className="metatext">Post by {content.submitter}</a>
              <a className="metatext">{content.createdAt.toString()}</a>
            </div>
            <a className="metalink" href={comments}>Comments</a>
          </div>
        </div>
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
        <ul className="contents-list">
          <span id="contentList">
            {posts}
          </span>
        </ul>
        <div className="sidebar">
          <a href="/CreateContent" className="contentButton">Submit Link</a>
        </div>
      </main>

      <div className="popbox signupbox">
        <div className='form'>
          <div className='formheading'>Sign Up!</div>
          <a class="close"><img src="/images/close-button.png" class="btn_close" title="Close Window" alt="Close" /></a>
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
         <div className='form'>
            <div className='formheading'>Login</div>
            <a href="#" class="close"><img src="/images/close_button.png" class="btn_close" title="Close Window" alt="Close" /></a>
            <form action="/Login" method="post">
              <label htmlFor="username"><span>Username <span className="required">*</span></span><input type="text" className="input-field" name="username" value="" maxLength="20"/></label>
              <label htmlFor="password"><span>Password <span className="required">*</span></span><input type="password" className="input-field" name="password" value="" maxLength="50"/></label>
              <label><span>&nbsp;</span><input type="submit" value="Login" /></label>
            </form>
        </div>
      </div>

      <footer id="pages">
        {pages}
      </footer>
    </body>
    </html>
  );
}

module.exports = HomePage;
