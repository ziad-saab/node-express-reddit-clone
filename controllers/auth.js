var express = require('express');

module.exports = function(myReddit) {
    var authController = express.Router();
    
    authController.get('/login', function(request, response) {
        
        response.render('login-form', {});
    });
    
    authController.post('/login', function(request, response) {
        response.send("TO BE IMPLEMENTED");
    });
    
    authController.get('/signup', function(request, response) {
        
        
        response.render('signup-form', {});
    
    });
    // Then, implement the code of app.post('/signup'). 
    // This code will receive the form data under request.body. 
    // There, you have to call myReddit.createUser and pass it the necessary info.
    // Once the createUser promise is resolved, use response.redirect to send the user to /auth/login.
    authController.post('/signup', function(request, response) {
        console.log(request.body);
        myReddit.createUser(request.body).then(response.redirect('/auth/login'));
    });
    
    return authController;
}