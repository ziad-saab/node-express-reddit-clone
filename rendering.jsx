var React = require('react')

var ReactDOMServer = require('react-dom/server');
function renderHtml(jsxStructure) {
  var outputHtml = ReactDOMServer.renderToStaticMarkup(jsxStructure);

  return '<!doctype html>' + outputHtml;
}
////  OVERALL LAYOUT /////
function Layout(data){
    return (
    <html>
        <head>
            <title>{data.title}</title>
            <link href='css/app.css' rel="stylesheet" type="text/css"/>
            <link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet' type='text/css'/>
            <link href='https://fonts.googleapis.com/css?family=Merriweather:700,300,400italic' rel='stylesheet' type='text/css'/>
        </head>
        <body>
            <div>
                <logo><a href='/'>reddit</a></logo>
            <nav>
                <li><a id='hot' href='/hot'>hot</a></li>
                <li><a id='new' href='/new'>new</a></li>
                <li><a id='con' href='/con'>controversial</a></li>
            </nav>
            </div>
            {data.children}
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
            <script src='main.js'></script>
        </body>
    </html>
);
}
////// POSTLIST /////
function Post(data) {
    return (
        <li className="container">
            <div className="postContent">
            <h2>
                <a href={data.url}>{data.title}</a>
            </h2>
                <p>Created By:{data.user} | on: {data.date}</p>
            </div>
            <div className='buttonForm'>
                <form  action='/voteContent' method='post'>
                <input name='contentId' type='hidden' value={data.contentId}/>
                <button name='upVote' type='submit' value='true'><img src="http://findicons.com/files/icons/2338/reflection/128/arrow_up_1.png" /></button>
                <p>{data.popularity}</p>
                <button name='upVote' type='submit' value='false'><img src="https://systopia.de/sites/default/files/Arrow%20Down%201.png" /></button>
                </form>
            </div>    
        </li>
        );
}
////// HOMEPAGE ///////
function renderHomePage (data) {

    var postList = data.map(function(item){
        return (
            <Post title={item.title} url={item.url} contentId={item.id} user={item.user.username} date={item.createdAt.toString()} popularity={item.dataValues.voteScore}/>
            );
    });
    var result = (
        <div>
            <h1>List of contents</h1>
            
            <ul>
                {postList}
            </ul>
    
        </div>
        );

    var layout = (
        <Layout title="homepage">
            {result}
        </Layout>
    )    
        
    return renderHtml(layout)
}


  
////// LOGIN PAGE ////////
function renderLoginPage (data) {
   var form = ( 
       <form action="signIn" method="post">
       <h1>Sign In</h1>
        <input type='text' name='username' placeholder='Please enter your username'/>
        <input type='password' name='password' placeholder='please enter your password'/>
        <button type='submit'>Sign In</button>
        </form> 
    )
    var layout = (
        <Layout title='Sign In'>
        {form}
        </Layout>
        )
    return renderHtml(layout)    
}
  
///// CREATE USER PAGE //////
function renderCreateUser (date){
    var form = ( 
       <form action="createUser" method="post">
       <h1>Create New User</h1>
        <input type='text' name='username' placeholder='Please enter a username'/>
        <input type='password' name='password' placeholder='please enter a password'/>
        <button type='submit'>Create User</button>
        </form> 
    )
    var layout =
    <Layout title='Create a New User'>
        {form}
    </Layout>
    return renderHtml(layout)  
}
 
///// CREATE CONTENT //////
function renderCreateContent (date){
    var form = ( 
       <form action="createContent" method="post">
        <h1>Create Content</h1>
        <input type='text' id='theTitle' name='title' placeholder='Please enter a title'/>
        <input type='text' id='theUrl' name='url' placeholder='please enter a url'/>
        <button type='button' id='sugg'>Suggest title</button>
        <button type='submit'>Submit</button>
        </form> 
    )
    var layout =
    <Layout title='Create New Content'>
        {form}
    </Layout>
    return renderHtml(layout)  
} 

  
            
module.exports = {
    renderHomePage: renderHomePage,
    renderLoginPage: renderLoginPage,
    renderCreateUser: renderCreateUser,
    renderCreateContent: renderCreateContent
}