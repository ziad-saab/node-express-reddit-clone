//Requiring npm packagaes
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var database = require('./database.js');

var parser = bodyParser.urlencoded({ extended: false });

app.post('/SignUp', parser, function(request, response){
    if(request.body.password === request.body.confirmPassword){
        database.createNewUser(request.body.user, request.body.password, request.body.email)
        .then(function(result){
            response.send('<h1>Nice Job!</h1>');
        });
    }
    else{
        response.send('<h1>Your passwords do not match. Please try again.</h1>');
    }
});
<<<<<<< HEAD
=======

var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
>>>>>>> d3d7045651422ae16465b8b8b9b69c93ffe7661e
