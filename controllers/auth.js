'use strict';
var express = require('express');

module.exports = function(myReddit) {
    var authController = express.Router();
    
    authController.get('/login', function(request, response) {
        var loginError = [];
        if (request.query.loginError) {
            loginError = request.query.loginError;
        }
        console.log('LoginError=',loginError);
        response.render('login-form', {loginError: loginError});
    });
    
    authController.post('/login', function(request, response) {
        myReddit.checkUserLogin(request.body.username, request.body.password)
        .catch(error => {
            console.log(error);
                response.redirect('/auth/login?loginError=' + error.message);
            return;
        })
        .then(result => {
            myReddit.createUserSession(result.id)
            .then(session => {
                response.cookie('SESSION', session.token);
                response.redirect('/');
                return;
            });
        });
    });
    
    authController.get('/signup', function(request, response) {
        response.render('signup-form');
    });
    
    authController.post('/signup', function(request, response) {
        console.log(request.body);
        myReddit.createUser(request.body)
        .then(user => {
            response.redirect('/auth/login');
        });
    });
    
    return authController;
}