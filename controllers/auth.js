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
        .then(() =>
            {response.redirect('/')}
        )
        .catch(error => {
                response.status(401).send('Unauthorized')
                });
        
    });
    
    authController.get('/signup', function(request, response) {
        response.render('signup-form', {});
    });
    // Then, implement the code of app.post('/signup'). 
    // This code will receive the form data under request.body. 
    // There, you have to call myReddit.createUser and pass it the necessary info.
    // Once the createUser promise is resolved, use response.redirect to send the user to /auth/login.
    authController.post('/signup', function(request, response) {

        myReddit.createUser(request.body).then(() =>{
        response.redirect('/auth/login');
        })
        .catch(err => {
            response.send(err.message);
        })
    });
    
    return authController;
}