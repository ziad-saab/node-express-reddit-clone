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
    <div>
      <Header loggedIn = {data.loggedIn} />
      <h2>Latest posts</h2>
      <ul>
        {postsList}
      </ul>
    </div>
  )
}

function Post(data) {
  return (
    <article>
      <h4><a href={data.url}> {data.title} </a></h4   >
      <h5>
        <p> Posted by {data.creator.username} </p>
        <p> {data.createdAt.toString()} </p>
        <p> VoteDiff: {data.voteDiff}... Score: {data.voteScore} </p>
      </h5>
      { data.loggedIn ? 
        <form action="/vote" method="POST">
          <input type='submit' name='upvote' value='+1'/>
          <input type='submit' name='downvote' value='-1'/>
          <input type='hidden' name='contentID' value={data.contentID} />
        </form>
      : "" }
    </article>
  );
}

function Header(data) {
  return (
    <header>
      { data.loggedIn ?
        <div>
          <form action="/logout" method="POST">
            <input type='submit' value='Log out...'/>
          </form>
          <a href="/create-content"> Create a post </a>
        </div>
      :
        <div>
          <a href="/login"> Login </a> <br/>
          <a href="/signup"> Sign up </a>
        </div>
      }
    </header>
  );
}

module.exports = {
  renderPage: renderPage,
  Layout: Layout,
  HomePage: HomePage
};
  