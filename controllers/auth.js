var express = require('express');

module.exports = function(myReddit) {
    var authController = express.Router();
    
    authController.get('/login', function(request, response) {
        response.render('login-form');
    });
    
    authController.post('/login', function(request, response) {
        
        myReddit.checkUserLogin(request.body.username, request.body.password)
        .then( result => {
            //console.log(result.id)
            return myReddit.createUserSession(result.id)
        })
        .then(data => {
            response.cookie('SESSION', data.token).redirect(302,'/');    
        })
        .catch(error => {
            response.send(401, "Unauthorized Error")
        })
    });
    
    authController.get('/signup', function(request, response) {
        response.render('signup-form');
    });
    
    authController.post('/signup', function(request, response) {
        var body = request.body;
        myReddit.createUser({
            username : body.username, 
            password : body.password
        }).then(result => {
            response.redirect(302,'/auth/login');
        });
    });
    
    return authController;
}