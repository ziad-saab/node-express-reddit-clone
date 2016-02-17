//Requiring npm packagaes
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var parser = bodyParser.urlencoded({ extended: false });
app.post('/SignUp', parser, function(request, response){
    if(request.body.password === request.body.confirmPassword){
        createNewUser(request.body.user, request.body.password, request.body.email)
        .then(function(result){
            response.send('<h1>Nice Job!</h1>');
        });
    }
    else{
        response.send('<h1>Your passwords do not match. Please try again.</h1>');
    }
});