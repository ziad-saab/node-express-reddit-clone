var express = require('express');
//var SESSION;

module.exports = function(myReddit) {
    var authController = express.Router();
    
    authController.get('/login', function(request, response) {
       response.render('login-form.pug');
    });
    
    authController.post('/login', function(request, response) {
       
        myReddit.checkUserLogin(request.body.username, request.body.password)
        .then(result => myReddit.createUserSession(result))
        .then(token => {
               // console.log("the token before sending", token)
                response.cookie('SESSION', token)
                response.redirect('/'); 
        }) .catch(error => {
             response.status(401).send('Unauthorized Access');
        });
        
    });

    authController.get('/signup', function(request, response) {
       response.render('signup-form.pug');
    });
    
    authController.post('/signup', function(request, response) {
      if (!request.body) return response.sendStatus(400)

    myReddit.createUser({
            username: request.body.username,
            password: request.body.password
          
        });
        
        response.redirect('https://redditnodejs-mattszabo.c9users.io/auth/login');

    });
    
    return authController;
}