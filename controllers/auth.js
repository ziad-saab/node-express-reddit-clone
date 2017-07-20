var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

//::NTS::
//All authentication functions require functions from reddit.js
//So we are pass it a redditAPI object. These 4 lines in index.js allows us to do this
//1. var RedditAPI = require('./lib/reddit.js');
//2. var myReddit = new RedditAPI(connection);
//3. var authController = require('./controllers/auth.js');
//4. app.use('/auth', authController(myReddit));
//Unlike other languages we dont have to declare myReddit 
//as a new Object of redditAPI(from reddit.js file) class here 
//It has already been done in index.js, so here we just pass it in module.exports = function(myReddit)

module.exports = function(myReddit) {
    
    var authController = express.Router();
    var urlBodyParser = bodyParser.urlencoded({ extended: false });
    
    authController.use(cookieParser()); //Question: would this run before every get and post?
    
    //Login Get
    authController.get('/login', function(request, response) {
        //authController.use(cookieParser()); //No need anymore. Put on top
        if(request.cookies.SESSION)
        {
            console.log("You are already logged in"); //Switch it up with a template here
            response.redirect('/');
        }
        else
        {
            response.render('login-form');
        }
        //response.render('login-form');
    });
    
    
    //Login Post
    authController.post('/login', urlBodyParser, function(request, response) {
        if (!request.body) return response.sendStatus(400);
    
        myReddit.checkUserLogin(request.body.username, request.body.password)
        .then(result => {
            // result is the user data as Object
            return myReddit.createUserSession(result.id);
        })
        .then(result => {
            //authController.use(cookieParser()); //No need anymore. Put on top
            //Set cookie
            response.cookie('SESSION', result); //SESSION can be accessed as request.cokkies.SESSION
            console.log('Successfully Logged In');
            response.redirect('/');
        })
        .catch(error => {
            //console.log("No such user");
            console.log("The Error is " + error);
            response.sendStatus(401);
        });
            
    });
    
    
    //Sign Up Get
    authController.get('/signup', function(request, response) {
        //authController.use(cookieParser()); //No need anymore. Put on top
        if(request.cookies.SESSION)
        {
            console.log("Log out to create new user"); //Switch it up with a template here
            response.redirect('/');
        }
        else
        {
            response.render('signup-form');
        }
        //response.render('signup-form');
    });
    
    
    //Sign Up Post
    authController.post('/signup', urlBodyParser, function(request, response) {
        //console.log(request.body);
        //request.body can be used due to the middleware urlBodyParser
        if (!request.body) return response.sendStatus(400);
        
        var newUser = {};
        newUser.username = request.body.username;
        newUser.password = request.body.password;

        myReddit.createUser(newUser)
            .then(result => {
                return response.redirect('/auth/login');    
            })
            .catch(error => {
                console.log(error.stack);
                return response.redirect('/auth/error');
            });
    });
    
    authController.get('/error', function(request, response) {
       response.render('error'); 
    });
    
    //FOR LOGGING OUT
    authController.get('/logout', function(request, response) {
        response.locals.logoutForm = true;
        response.render('logout-form');
    });
    
    authController.post('/logout', function(request, response) {
        myReddit.deleteSessionFromToken(request.cookies.SESSION)
        .then(result => { //NTS:then cause promises are async
            response.clearCookie("SESSION");
            console.log("You Logged Out");
            response.locals.logoutForm = false;
            response.redirect('/'); 
        });
    });
    return authController;
};

// ::NTS:: WHAT NOT TO DO
// Alternatively we could have also done the following BUT We DONT because
// then we would have to create a whole new db connection here and also a redditAPI object
// Instead of simply having it passed as module.exports = function(myReddit) {....}
// Maybe even make it into a class and export it as a class. 
// TOO MUCH redundancy

/*var express = require('express');

var authController = express.Router();
    
authController.get('/login', function(request, response) {
    response.render('login-form');
});
    
authController.post('/login', function(request, response) {
    response.send("TO BE IMPLEMENTED");
});
    
authController.get('/signup', function(request, response) {
    response.render('signup-form');
});
    
authController.post('/signup', function(request, response) {
    response.send("TO BE IMPLEMENTED");
});
    
module.exports ... ;*/