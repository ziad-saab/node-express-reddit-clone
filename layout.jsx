var React = require('react');
var ReactDOMServer = require('react-dom/server');


function renderPage(component, title) {
  var jsx = (
    <Layout title={title}>
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
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
        <script src="js/client.js"></script>
        <link type="text/css" rel="stylesheet" href="css/style.css"/>
        <title>{data.title}</title>
      </head>
      <body>
        {data.children}
      </body>
    </html>
  );
}

function HomePage (data) {
  var postsList = data.posts.map( item => {
    return (
      <li key={item.id}>
        <Post title = {item.title}
              url = {item.url}
              contentID = {item.id}
              createdAt = {item.createdAt}
              creator = {item.user}
              loggedIn = {data.loggedIn}
              voteScore = {item.get('voteScore')}
              voteDiff = {item.get('voteDiff')} />
      </li>
    );
  });

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
  return (
    <article className='post'>
    { data.loggedIn ?
      <section className='post-vote'>
        <form action="/vote" method="POST">
          <input className='button' id='upvote' type='submit' name='upvote' value='+1'/>
          <h5 className='vote-score'> {data.voteDiff} </h5>
          <input className='button' id='downvote' type='submit' name='downvote' value='-1'/>
          <input type='hidden' name='contentID' value={data.contentID} />
        </form>
      </section>
    :
      null
    }
      <section className='post-details'>
        <h4 className='post-title'><a href={data.url}> {data.title} </a></h4>
        <p className='post-creator'> Posted by <strong>{data.creator.username}</strong> </p>
        <p className='post-timestamp'> {data.createdAt.toString()} </p>
      </section>
    </article>
  );
}

function Header (data) {
  return (
    data.loggedIn ?
      <nav>
        <h1 className='nav-title'> "Reddit" </h1>
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
  Login: Login,
  Signup: Signup,
  CreateContent: CreateContent
};
