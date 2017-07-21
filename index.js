var express = require('express');
var mysql = require('promise-mysql');

// Express middleware
var bodyParser = require('body-parser'); // reads request bodies from POST requests
var cookieParser = require('cookie-parser'); // parses cookie from Cookie request header into an object
var morgan = require('morgan'); // logs every request on the console
var checkLoginToken = require('./lib/check-login-token.js'); // checks if cookie has a SESSION token and sets request.user
var onlyLoggedIn = require('./lib/only-logged-in.js'); // only allows requests from logged in users

// Controllers
//For Sign UP and Login
var authController = require('./controllers/auth.js');

/*
 Load the RedditAPI class and create an API with db connection. This connection will stay open as
 long as the web server is running, which is 24/7.
 */
var RedditAPI = require('./lib/reddit.js');
var connection = mysql.createPool({
    user: 'root',
    database: 'reddit2'
});
var myReddit = new RedditAPI(connection);


// Create a new Express web server
var app = express();

// Specify the usage of the Pug template engine
app.set('view engine', 'pug');

/*
 This next section specifies the middleware we want to run.
 app.use takes a callback function that will be called on every request
 the callback function will receive the request object, the response object, and a next callback.
 this type of function is called a "middleware".
 express will run these middleware in a pipeline, one after the other on each request.
 the order the middleware are declared in is important. for example, the cookieParser middleware will
 add a .cookie property to the request object. the checkLoginToken middleware will then use request.cookie
 to check if a user is logged in. this means cookieParser needs to run before checkLoginToken.
 */

// This middleware will log every request made to your web server on the console.
app.use(morgan('dev'));

// This middleware will parse the POST requests coming from an HTML form, and put the result in request.body.
app.use(bodyParser.urlencoded({extended: false}));

// This middleware will parse the Cookie header from all requests, and put the result in request.cookies as an object.
app.use(cookieParser());

/*
This custom middleware checks in the cookies if there is a SESSION token and validates it.

NOTE: This middleware is currently commented out! Uncomment it once you've implemented the RedditAPI
method `getUserFromSession`
 */
//this checks if user is logged in, if yes 
//loggedInUser gets values from the users table, else it is set to false
app.use(checkLoginToken(myReddit));






/*
app.use can also take a path prefix as a parameter. the next app.use says that anytime the request URL
starts with /auth, the middleware exported by controllers/auth.js should be called.

this type of middleware is a common way to modularize code in an Express application. basicaly we're
saying that any URL under /auth has to do with authentication, and we put all the sub-routes in their
own file to prevent clutter and improve maintainability.

the file at controllers/auth.js contains what is called an Express Router. a Router is like a tiny
express application that takes care of its own set of paths. look at the file for more information.

The authController needs access to the RedditAPI to do its work, so we pass it as a parameter and the
controller gets returned from that function.
 */
//The authController gets a myRedit object passed into it to be able to use all 
app.use('/auth', authController(myReddit));

/*
 This next middleware will allow us to serve static files, as if our web server was a file server.
 To do this, we attach the middleware to the /static URL path. This means any URL that starts with
 /static will go thru this middleware. We setup the static middleware to look for files under the public
 directory which is at the root of the project. This basically "links" the public directory to a URL
 path called /static, and any files under /public can be requested by asking for them with /static
 followed by the path of those files.

 If you look in views/layout.pug, you'll see that we add a <link> tag referencing /static/app.css.
 This is a CSS file that is located in the public directory. For now the file is mostly empty, but
 you can add stuff to it if you want to make your site look better.

 Eventually you could also load browser JavaScript and make your site more dynamic. We will be looking
 at how to do this in the next few weeks but don't hesitate to take a head start.
 */
app.use('/static', express.static(__dirname + '/public'));

// Regular home Page
app.get('/', function(request, response) {
    response.locals.isSubreddit = false; 
    myReddit.getAllPosts(undefined)
    .then(function(posts) {
        console.log('These are the homepage posts' + posts);
        response.render('homepage', {posts: posts});
    })
    .catch(function(error) {
        response.render('error', {error: error});
    });
});

// Listing of subreddits
app.get('/subreddits', function(request, response) {
    /*
    1. Get all subreddits with RedditAPI
    2. Render some HTML that lists all the subreddits
     */
    
    response.send("TO BE IMPLEMENTED");
});

// Subreddit homepage, similar to the regular home page but filtered by sub.
app.get('/r/:subreddit', function(request, response) {
    //
    return myReddit.getSubredditByName(request.params.subreddit)
    .then(result => {
       if (result === null)
       {
            //response.send("No such subreddit");
            response.sendStatus(404);
       }
       else
       {
           response.locals.isSubreddit = result;    //for pug,this is true now
           console.log("The result is" + result);
           return result;
       }
    })
    .then(result=>{
        //myReddit.getAllPosts(result.name)
        //giving it the object result, then I will do onject.hasOwnProperty(name) in getAllPost() function
        console.log('result is: ' + result);
        return myReddit.getAllPosts(result);
    })
    .then(posts => {
       response.render('homepage',{posts: posts});
    })
    .catch(error => {
        response.render('error', {error: error});
    });
});

// Sorted home page
app.get('/sort/:method', function(request, response) {
    // since I need to return them as promise, using resolve()
    return Promise.resolve()
    .then(result =>{
        var method = {};
        method.sortMethod = request.params.method;
        if (method.sortMethod !== "hot" && method.sortMethod !== "top")
        {
            console.log('Invalid sort method: '+ method.sortMethod);
            response.sendStatus(404);
        }
        else
        {
            return myReddit.getAllPosts(method);
        }
    })
    .then(result => {
       //print sorted data out to webpage
       response.locals.isSubreddit = false;
       response.render('homepage',{posts: result});
    })
    .catch(error => {
        response.render('error', {error: error});
    });
    //response.send("TO BE IMPLEMENTED");
});

//sorted Subreddit
app.get('/r/:subreddit/:method', function(request, response){
   return myReddit.getSubredditByName(request.params.subreddit)
   .then(result => {
        var parameters = {};
        parameters.sortMethod = request.params.method;
        parameters.name = request.params.subreddit;
        parameters.description = result.description;
        if (parameters.sortMethod !== "hot" && parameters.sortMethod !== "top")
        {
            console.log('Invalid sort method: '+ parameters.sortMethod);
            response.sendStatus(404);
        }
        else
        {
            response.locals.isSubreddit = parameters;
            console.log(response.locals.isSubreddit);
            return myReddit.getAllPosts(parameters);
        }
   })
   .then(result => {
        response.render('homepage',{posts: result});
   })
   .catch(error => {
       response.render('error', {error: error});
   });
});

app.get('/post/:postId', function(request, response) {
    //response.send("TO BE IMPLEMENTED");
    response.locals.singlePost = false;
    return Promise.all([myReddit.getSinglePost(request.params.postId), myReddit.getCommentsForPost(request.params.postId)])
    .then(result => {
        //get single post returns A SINGLE POST, not an array
        console.log(result[0]);
        //case 1, No existing post
        if(result[0].id === null)
        {
            //post dont exist
            //console.log("result of first promise length:" + JSON.stringify(result[0]));
            //console.log("result of second promise length:" + result[1].length);
            //response.send("NO SUCH POST ID");
            response.sendStatus(404);
        }
        //case 2, post found
        else
        {
            response.locals.singlePost = result[0];
            //the name comments must be used in the each in pug
            //ie, for each comment in *comments*
            response.render('single-post-view', {comments: result[1]});
        }
        //case 3 There are comments
    });
});

/*
This is a POST endpoint. It will be called when a form is submitted with method="POST" action="/vote"
The goal of this endpoint is to receive an up/down vote by a logged in user.
Since you can only vote if you are logged in, the onlyLoggedIn middleware is interposed before the final request handler.
The app.* methods of express can actually take multiple middleware, forming a chain that is only used for that path

This basically says: if there is a POST /vote request, first pass it thru the onlyLoggedIn middleware. If that
middleware calls next(), then also pass it to the final request handler specified.
 */
app.post('/vote', onlyLoggedIn, function(request, response) {
    //response.send("TO BE IMPLEMENTED");
    return Promise.resolve()
    .then(()=>{
        console.log("creating vote")
        var vote = {};
        vote.postId = Number(request.body.postId);
        vote.userId = request.loggedInUser.id;
        vote.voteDirection = Number(request.body.voteDirection);
        console.log("My Vote Object is" + JSON.stringify(vote));
        return myReddit.createVote(vote);
    })
    .then(result => {
        response.redirect('back');
    })
    .catch(error =>{
        console.log(error.stack);
    })
});

// This handler will send out an HTML form for creating a new post
app.get('/createPost', onlyLoggedIn, function(request, response) {
    return myReddit.getAllSubreddits()
    .then(results =>{
        response.render('create-post-form', {posts: results});    
    })
});

// POST handler for form submissions creating a new post
app.post('/createPost', onlyLoggedIn, function(request, response) {
    console.log("the user has props: " + request.loggedInUser.id);
    console.log("request.body has" + request.body);
    console.log("title " + request.body.title);
    console.log("subId " + request.body.subData);
    return Promise.resolve()
    .then(result => {
        var postData = {};
        postData.title = request.body.title;
        postData.url = request.body.url;
        postData.userId = request.loggedInUser.id;
        postData.subredditId = request.body.subData;
        //console.log(postData.subredditId);
        return myReddit.createPost(postData);
    }).then(result => {
        response.redirect('/post/' + result); //result is the insertId go up to /post/:postId
    });
});
        
    
    //


// Listen
var port = process.env.PORT || 3000;
app.listen(port, function() {
    // This part will only work with Cloud9, and is meant to help you find the URL of your web server :)
    if (process.env.C9_HOSTNAME) {
        console.log('Web server is listening on https://' + process.env.C9_HOSTNAME);
    }
    else {
        console.log('Web server is listening on http://localhost:' + port);
    }
});
