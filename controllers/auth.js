var express = require('express');



module.exports = function(myReddit) {
    var authController = express.Router();
    
    
   
    
    authController.get('/login', function(request, response) {
        response.render("login-form");
    });
    
    authController.post('/login', function(request, response) {
        
        //response.send("Attempting login -> username: " + request.body.username + ", password: " + request.body.password);

        myReddit.checkUserLogin({
            username: request.body.username,
            password: request.body.password
        })
        
        // .then(result => {
        //     myReddit.createUser(result.id)
        // })
        
    });
    
    
    
    authController.get('/signup', function(request, response) {
        response.render('signup-form');
    });
    
    authController.post('/signup', function(request, response) {

        console.log("User created -> username: " + request.body.username + ", password: " + request.body.password);
        
        myReddit.createUser({
            username: request.body.username,
            password: request.body.password
        })
        
        response.redirect('/login');
    });
    
    return authController;
}

