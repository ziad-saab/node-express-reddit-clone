var express = require('express');

module.exports = function(myReddit) {
    var authController = express.Router();
    
    authController.get('/login', function(request, response) {
        
        response.render('login-form', {});
    });
    
    authController.post('/login', function(request, response) {
        console.log(request.body);
// In lib/reddit.js, complete the code of the checkUserLogin function following the instructions in comments.
// In lib/reddit.js, complete the code of the createUserSession function following the instructions in comments.
// When these two functions are done, start working on the POST handler for /login:

// Use the checkUserLogin function, passing it the request.body username and password

// If the login check is unsuccessful, send a 401 Unauthorized status to the browser, else move to step 3

// Since login is successful, use the checkUserLogin response to find the user's ID, and pass it to the createUserSession function

// When that function is done, you'll get back a random session ID. Use Express response.cookie to set a cookie with name SESSION and value being that session id

// Use response.redirect to send the user back to the home page.
        myReddit.checkUserLogin(request.body.username, request.body.password)
        .then(result => { 
            return myReddit.createUserSession(result.id)
        })
        .then(token => { 
            console.log(token)
            response.cookie('SESSION', token);
        })
        .then(useless =>
            {response.redirect('/')}
        )
        .catch( error => { //response.render('error', {error: error})
            response.status(401).send('401 Unauthorized.')
        })
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
        myReddit.createUser(request.body)
        .then(response.redirect('/auth/login'));
    });
    
    return authController;
}