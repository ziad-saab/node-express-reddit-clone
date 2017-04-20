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

    authController.post('/signup', function(request, response) {
        console.log(request.body);
        myReddit.createUser(request.body).then(() =>{
        response.redirect('/auth/login');
        })
        .catch(err => {
            response.send(err.message);
        })
    });
    
   // Add a /auth/recover page through the controllers/auth.js Router with a form 
   // that asks for the email address. Make it POST to /auth/createResetToken.
   authController.get('/recover', function(request, response) {
       console.log('hello;');
       response.render('reset-form', {});
   });
   
   authController.post('/createResetToken', function(request, response){
      myReddit.createPasswordResetToken(request.body.email) 
   });
    
    return authController;
}