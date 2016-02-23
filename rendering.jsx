var React = require('react');
var ReactDOMServer = require('react-dom/server');

function renderHtml(jsxStructure) {
    var outputHtml = ReactDOMServer.renderToStaticMarkup(jsxStructure);
    return '<!doctype html>' + outputHtml;
}



var arrFunctions = {
    
    renderLogin: function(data) {
        var structure = (
            <html>
                <head>
                    <title>Login!</title>
                </head>
                <body>
                <h1>Login</h1>
                    <form action="/login" method="post">
                        {data.error && <div>{data.error}</div>}
                        <input type="text" name="username"/>
                        <input type="password" name="password" placeholder="Enter your password"/>
                        <button type="submit">Sign in!</button>
                    </form>
                </body>
            </html>
        );
        return renderHtml(structure);
    },
    renderSignup: function(data) {
        var structure = (
            <html>
                <head>
                    <title>Sign Up</title>
                </head>
                <body>
                    <h1>Sign up!</h1>
                    <form action="/signup" method="post">
                        {data.error && <div>{data.error}</div>}
                        <input type="text" name="username" placeholder="Create a username"/>
                        <input type="password" name="password" placeholder="Create a password"/>
                        <input type="password" name="confirmPassword" placeholder="Confirm password"/>
                        <button type="submit">Sign up!</button>
                    </form>
                </body>
            </html>
        );
        return renderHtml(structure);
    },
    renderCreatePost: function(data) {
        var structure = (
            <html>
            <head>
                <title>Create Post</title>
            </head>
            <body>
                <h1>Create your post</h1>
                <form action="/createPost" method="post">
                    {data.error && <div>{data.error}</div>}
                    <input type="text" name="url" placeholder="Enter a URL to content"/>
                    <input type="text" name="title" placeholder="Enter the title of your content"/>
                    <button type="submit">Create!</button>
                </form>
            </body>
        </html>
        );
        return renderHtml(structure);
    },
    homePage: function(data) {
        var structure = (
            <html>
                <head>
                    <title>Homepage</title>
                </head>
                <body>
                    <h1>List of contents</h1>
                    <ol>
                        {/*shifting to js land*/}
                        {
                            data.map(function(li) {
                                return (
                                    <li>
                                        <h1>{li.title}</h1>
                                        <a href={li.url}>{li.url}</a>
                                        <p>Created by {li.User.dataValues.userName}</p>
                                        <form action='/voteContent' method='post'>
                                            <input type='hidden' name='upVote' value='true'/>
                                            <input type='hidden' name='contentId' value={li.id}/>
                                            <button type='submit'>upvote this</button>
                                        </form>
                                        <form action='/voteContent' method='post'>
                                            <input type='hidden' name='upVote' value='false'/>
                                            <input type='hidden' name='contentId' value={li.id}/>
                                            <button type='submit'>downvote this</button>
                                        </form>
                                    </li>
                                );
                            })
                        }
                    </ol>
                </body>
            </html>
        );
        return renderHtml(structure);
    }
};

module.exports = arrFunctions;

// var output = "";
// allPosts.forEach(function (onePost) {
//     output = output  + "<li><h2><a href=http://"+onePost.url+">"+onePost.title+"</a></h2><p>Created by "+onePost.User.dataValues.userName+"</p><form action='/voteContent' method='post'>
// <input type='hidden' name='upVote' value='true'>
// <input type='hidden' name='contentId' value='onePost.id'>
// <button type='submit'>upvote this</button>
// </form>
// <form action='/voteContent' method='post'>
// <input type='hidden' name='upVote' value='false'>
// <input type='hidden' name='contentId' value='onePost.id'><button type='submit'>downvote this</button></form></li>";
// // });
// // var template = "<div><h1>List of Contents</h1><ol>"+output+"</ol></div>";
// // res.send(template);