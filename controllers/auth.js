var express = require('express');

module.exports = function(myReddit) {
    var authController = express.Router();
    
    authController.get('/login', function(request, response) {
        response.render('login-form', {});
    });        
    
    authController.post('/login', function(request, response) {
    
        myReddit.checkUserLogin(request.body.username, request.body.password)
        .then(result => { 
            return myReddit.createUserSession(result.id)
        })
        .then(cookie => { 
            response.cookie('SESSION', cookie);
        })
        .then(result =>
            {response.redirect('/')}
        )
        .catch(error => {
                response.status(401).send('Unauthorized')
                });
        
    });
    
    authController.get('/signup', function(request, response) {
        response.render('signup-form', {});

    });
    
    authController.post('/signup', function(request, response) {
        myReddit.createUser(request.body).then(response.redirect('/auth/login'));

    });
    
    return authController;
}