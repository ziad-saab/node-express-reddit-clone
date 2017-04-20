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
      .then(response.send('email sent'))
   });
   
   authController.get('/resetPassword', function(request, response){
    // Output a <form> with a "new password" field. When the form should also 
    // have a hidden input that will be whatever is in the token param of the query string. 
    // The form will POST to /resetPassword with the token and the newPassword.
        response.render('password-form', {token: request.query.token});
   })
   authController.post('/resetPassword', function(request, response){
       console.log(request.body);
       myReddit.resetPassword(request.body.token, request.body.newPassword)
       .then(()=>{
            response.redirect('/auth/login');
       })
       
   })
    
    return authController;
}