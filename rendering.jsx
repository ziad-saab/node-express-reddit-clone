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
            <link href='/css/app.css' rel="stylesheet" type="text/css"/>
            <link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet' type='text/css'/>
            <link href='https://fonts.googleapis.com/css?family=Merriweather:700,300,400italic' rel='stylesheet' type='text/css'/>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.css"/>
        </head>
        <body>
            <div>
                <logo><a href='/'>saidit<i className="fa fa-reddit-alien"></i></a></logo>
            <nav>
                <li><a id='hot' href='/hot'><i className='fa fa-fire'></i> hot</a></li>
                <li><a id='new' href='/new'>new</a></li>
                <li><a id='con' href='/con'>controversial</a></li>
                <li><a id='createContent' href='/createContent'><i className="fa fa-reddit-square"></i> Create Content</a></li>
                <li><a id='createUser' href='/createUser'>Sign Up</a></li>
                <li><a id='SignIn' href='/SignIn'>Sign In</a></li>
                <li><a id='logOut' href='/logOut'><i className='fa fa-sign-out'></i> Log Out</a></li>
            </nav>
            </div>
            {data.children}
            <script src='/app-compiled.js'></script>
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
                <p>Created By:{data.user} | on: {data.date} <span className='hide'> - Hide? - </span><a href={'/content/'+ data.contentId}>Comments</a></p>
                
            </div>
            <div className='buttonForm'>
                <form className='voteForm'>
                <input name='contentId' type='hidden' value={data.contentId}/>
                <input name='upVote' type='hidden' value='true'/>
                <button className ='button' type='submit'><i className='fa fa-arrow-up'></i></button>
                </form>
                
                <p>{data.popularity}</p>
                
                 <form className='voteForm'>
                <input name='contentId' type='hidden' value={data.contentId}/>
                <input name='upVote' type='hidden' value='false'/>
                <button className ='button' type='submit'><i className='fa fa-arrow-down'></i></button>
                </form>
                
            </div>    
        </li>
        );
}

//////// COMMENT PAGE //////
function renderCommentPage( data) {
    var singlePost = function(item){
            return (
            <Post title={item.title} url={item.url} contentId={item.id} user={item.user && item.user.username || 'Anonymous'} date={item.createdAt.toString()} popularity={item.dataValues.voteScore}/>
            );
    };
            
    var result = (
        <div>
            <ul>
                {singlePost(data)}
            </ul>
        </div>
        );
    
    var layout = (
        <Layout title="Comments">
            {result}
        </Layout>
    )  
    
    return renderHtml(layout)
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
    renderCreateContent: renderCreateContent,
    renderCommentPage: renderCommentPage
}