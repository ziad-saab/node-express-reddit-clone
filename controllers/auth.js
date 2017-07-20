var express = require('express');

module.exports = function(myReddit) {
    var authController = express.Router();
    
    authController.get('/login', function(request, response) {
        response.render('login-form');
    });
    
    authController.post('/login', function(request, response) {
        
        myReddit.checkUserLogin(request.body.username, request.body.password)
        .then( result => {
            console.log(result + "RESULT FROM CHECK USER")
            myReddit.createUserSession(result);
            response.send("Ran the program");
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
            response.redirect('/auth/login');
        });
    });
    
    return authController;
}

// myReddit.createUser({
//     username: 'PM_ME_CUTES3',
//     password: 'abc123'
// })
//     .then(newUserId => {
//         // Now that we have a user ID, we can use it to create a new post
//         // Each post should be associated with a user ID
//         console.log('New user created! ID=' + newUserId);

//         return myReddit.createPost({
//             title: 'Hello Reddit! This is my first post',
//             url: 'http://www.digg.com',
//             userId: newUserId
//         });
//     })
//     .then(newPostId => {
//         // If we reach that part of the code, then we have a new post. We can print the ID
//         console.log('New post created! ID=' + newPostId);
//     })
//     .catch(error => {
//         console.log(error.stack);
//  });
