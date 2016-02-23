require('babel-register');
var createNewUser = require('./data-model.js').createNewUser;
var createNewContent = require('./data-model.js').createNewContent;
var checkLoginToken = require('./data-model.js').checkLoginToken;
var displayContent = require('./data-model.js').displayContent;
var rendering = require('./rendering.jsx');
var loginUser = require('./data-model.js').loginUser;
var createSessionToken = require('./data-model.js').createSessionToken;
var express = require('express');
var app = express();
var path = require('path');
var bcrypt = require('bcrypt');
app.use(require('body-parser').urlencoded({ extended: false }));// Charge le middleware de gestion des paramètres
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(checkLoginToken);



//HOMEPAGE
app.get('/', function (req, res){
   displayContent(function(results) {
      /* res.send(results);*/
    res.send(rendering.renderHomePage({}))
   })
})


//SIGNUP PAGE + FORM
// GET method route for the form
app.get('/signup', function(req, res){
    res.sendFile(path.join(__dirname + '/signupForm.html'));
    res.send(rendering.renderSignup({}))


var html = rendering.renderSignup();
    res.send(html);
    
})
 

app.post('/signup', function(req, res){
    createNewUser(req.body.username, req.body.password, function (newUser) {
        res.redirect('/login');
    })
})




//LOGIN PAGE + FORM
// GET method route for the form
app.get('/login', function(req, res){
    res.send(rendering.renderLogin({}))
});

app.post('/login', function(req, res){
    loginUser(req.body.username, req.body.password, function (err, token) {
        if (err){
            res.redirect('/login?error=invalid username or password');
        }
        else {
            res.cookie('SESSION', token)
            res.redirect('/');
        }
    })
})


//CREATE POST PAGE + FORM
// GET method route for the form
app.get('/createPost', function(req, res){
    res.sendFile(path.join(__dirname + '/createPostForm.html'));
    
    res.send(rendering.renderCreatePost({}))
});

app.post('/createPost', function(req, res){
    req.loggedInUser.createContent({
        title: req.body.title,
        url: req.body.url, 
    }).then(
        function(content){
            res.redirect('/');
        })
});

app.listen(process.env.PORT);