var express = require('express');
var bodyParser = require('body-parser'); // added
var mysql = require('promise-mysql'); //
var parse_middle = bodyParser.urlencoded({extended:false});


module.exports = function(myReddit) {
    var authController = express.Router();

    authController.get('/login', function(request, response) {
        response.render("login-form"); // CHECK
    });

    authController.post('/login', parse_middle, function(req, res) {
        console.log('boom');
        var username = req.body.username;
        var password = req.body.password;

        myReddit.checkUserLogin(username, password)
        .then(user => {
          return myReddit.createUserSession(user.id);
        })
        .then(token => {console.log("here is the token :  " + token);
            res.cookie("SESSION", token);})
        .then(() => res.redirect(302, '/'))
        .catch( e =>{
          res.status(401).send(e.message);
        })

    });

    authController.get('/signup', function(request, response) {
        response.render("signup-form"); // CHECK
    });

    authController.post('/signup', parse_middle, function(req,res){
    myReddit.createUser({
        username : req.body.username,
        password : req.body.password
      }).then(res.redirect(302, '/auth/login')); // CHECK
    });

    return authController;
}
