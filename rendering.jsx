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
            <link href='app.css' rel="stylesheet" type="text/css"/>
        </head>
        <body>
            {data.children}
        </body>
    </html>
);
}
////// POSTLIST /////
function Post(data) {
    return (
        <li>
            <h2>
                <a href={data.url}>{data.title}</a>
            </h2>
                <form action='/voteContent' method='post'>
                <input name='contentId' type='hidden' value={data.contentId}/>
                <button name='upVote' type='submit' value='true'>Upvote</button>
                <button name='upVote' type='submit' value='false'>DownVote</button>
                </form>
        </li>
        );
}
////// HOMEPAGE ///////
function renderHomePage (data) {
    
    var postList = data.map(function(item){
        return (
            <Post title={item.title} url={item.url} contentId={item.id}/>
            );
    });
    var result = (
        <div>
            <h1>Your random Posts</h1>
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
        <input type='text' name='title' placeholder='Please enter a title'/>
        <input type='text' name='url' placeholder='please enter a url'/>
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