var express = require('express');
var bodyParser = require('body-parser');

module.exports = function(myReddit) {
    
    var authController = express.Router();
    var urlBodyParser = bodyParser.urlencoded({ extended: false });
    
    authController.get('/login', function(request, response) {
        response.render('login-form');
    });
    
    authController.post('/login', urlBodyParser, function(request, response) {
        //response.send("TO BE IMPLEMENTED");
        if (!request.body) return response.sendStatus(400);
        
        myReddit.checkUserLogin(request.body.username, request.body.password)
        .then(result => {
            console.log('Successfully Logged In');
            response.redirect('/');
        })
        .catch(error => {
            //console.log("No such user");
            
            console.log("The Error is " + error);
            //response.redirect('/auth/error');
        });
            
    });
    
    authController.get('/signup', function(request, response) {
        response.render('signup-form');
    });
    
    authController.post('/signup', urlBodyParser, function(request, response) {
        //console.log(request.body);
        //request.body can be used due to the middleware urlBodyParser
        if (!request.body) return response.sendStatus(400);
        
        var newUser = {};
        newUser.username = request.body.username;
        newUser.password = request.body.password;

        myReddit.createUser(newUser)
            .then(result => {
                return response.redirect('/auth/login');    
            })
            .catch(error => {
                console.log(error.stack);
                return response.redirect('/auth/error');
            });
    });
    
    authController.get('/error', function(request, response) {
       response.render('error'); 
    });
    
    return authController;
};

// NTS: WHAT NOT TO DO
// Alternatively we could have also done the following BUT We DONT because
// then we would have to create a whole new db connection here and also a redditAPI object
// Instead of simply having it passed as module.exports = function(myReddit) {....}
// Maybe even make it into a class and export it as a class. 
// TOO MUCH redundancy

/*var express = require('express');

var authController = express.Router();
    
authController.get('/login', function(request, response) {
    response.render('login-form');
});
    
authController.post('/login', function(request, response) {
    response.send("TO BE IMPLEMENTED");
});
    
authController.get('/signup', function(request, response) {
    response.render('signup-form');
});
    
authController.post('/signup', function(request, response) {
    response.send("TO BE IMPLEMENTED");
});
    
module.exports ... ;*/
