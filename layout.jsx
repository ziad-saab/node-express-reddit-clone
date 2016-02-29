var React = require('react');
var ReactDOMServer = require('react-dom/server');


function renderPage(component, title) {
  var jsx = (
    <Layout title={title}>
      <div id='main'></div>
      {component}
    </Layout>
  );

  var html = ReactDOMServer.renderToStaticMarkup(jsx);

  return '<!doctype html>' + html;
}

function Layout (data) {
  return (
    <html>
      <head>
        <link type="text/css" rel="stylesheet" href="/css/style.css"/>
        <title>{data.title}</title>
      </head>
      <body>
        {data.children}
        <script src="/js/client-packed.js"></script>
      </body>
    </html>
  );
}

function HomePage (data) {
  var postsList = data.posts.map(
    item => {
      return (
        <li key={item.id}>
          <Post
            contentId = {item.id}
            creator = {item.creator}
            url = {item.url}
            title = {item.title}
            createdAt = {item.createdAt}
            loggedIn = {data.loggedIn}
            voteScore = {item.voteScore}
            voteDiff = {item.voteDiff}
            userVoted = {item.loggedInVote}
          />
        </li>
      );
    }
  );

  return (
    <main>
      <Header loggedIn = {data.loggedIn} />
      <ul>
        {postsList}
      </ul>
    </main>
  )
}

function Post (data) {
  var upVoteClass = 'vote-button';
  var downVoteClass = 'vote-button';

  if (data.userVoted === 1) {
    upVoteClass += ' up';
  }
  else if (data.userVoted === -1) {
    downVoteClass += ' down';
  }

  return (
    <article className='post'>
    { data.loggedIn ?
      <section className='post-vote'>
        <form>
          <button className={upVoteClass} id='upvote' type='button' name='1' value={data.contentId}> ▲ </button>
          <h5 className={'vote-score ' + data.contentId}> {data.voteDiff} </h5>
          <button className={downVoteClass} id='downvote' type='button' name='-1' value={data.contentId}> ▼ </button>
        </form>
      </section>
    :
      null
    }
      <section className='post-details'>
        <h4 className='post-title'> <a href={data.url}> {data.title} </a> </h4>
        <p className='post-creator'> Posted by <strong> {data.creator} </strong> </p>
        <a href={'/content/' + data.contentId}><p> Comments </p></a>
        <p className='post-timestamp'> {data.createdAt.toString()} </p>
      </section>
    </article>
  )
}

function CommentPage (data) {
  return (
    <main>
      <Header loggedIn = {data.loggedIn} />
      <Post contentId = {data.post.id}
            creator = {data.post.creator}
            url = {data.post.url}
            title = {data.post.title}
            createdAt = {data.post.createdAt}
            loggedIn = {data.loggedIn}
            voteDiff = {data.post.voteDiff}
            userVoted = {data.post.loggedInVote}/>
    </main>
  )
}

function Header (data) {
  return (
    data.loggedIn ?
      <nav>
        <h1 className='nav-title'> "Reddit" </h1>
        <p className='current-user'>Logged in as... <strong>{data.loggedIn}</strong> </p>
        <form action="/create-content" method="GET">
          <input type='submit' value='Create a post...'/>
        </form>
        <form action="/logout" method="POST">
          <input type='submit' value='Log out...'/>
        </form>
      </nav>
    :
      <nav>
        <h1 className='nav-title'> "Reddit" </h1>
        <form action="/login" method="GET">
          <input type='submit' value='Log in...'/>
        </form>
        <form action="/signup" method="GET">
          <input type='submit' value='Sign up...'/>
        </form>
      </nav>
  );
}

function Login () {
  return (
    <main className='external-form'>
      <h4> Log in... </h4>
      <form action="/login" method="POST">
        <input type="text" name="username" placeholder=" username"/> <br/>
        <input type="password" name="password" placeholder=" password"/> <br/>
        <input type="submit" name="submit" value="Log in..."/>
      </form>
    </main>
  );
}

function Signup () {
  return (
    <main className='external-form'>
      <h4> Sign up... </h4>
      <form action="/signup" method="POST">
        <input type="text" name="username" placeholder=" username"/> <br/>
        <input type="password" name="password" placeholder=" password"/> <br/>
        <input type="password" name="passwordConfirm" placeholder=" confirm password"/> <br/>
        <input type="submit" name="submit" value="Sign up!"/>
      </form>
    </main>
  );
}

function CreateContent () {
  return (
    <main className='external-form'>
      <h4> Create a post </h4>
      <form action="/create-content" method="POST">
        <input type="text" id="title-field" name="title" placeholder=" title"/>
        <br/>
        <input type="text" id="url-field" name="url" placeholder=" URL"/>
        <button id="suggest-button" type="button" name="suggest"> Suggest a title... </button>
        <br/>
        <input type="submit" name="submit" value="Post content..."/>
      </form>
    </main>
  );
}

module.exports = {
  renderPage: renderPage,
  Layout: Layout,
  HomePage: HomePage,
  CommentPage: CommentPage,
  Login: Login,
  Signup: Signup,
  CreateContent: CreateContent
};
