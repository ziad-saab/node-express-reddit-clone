//Requiring npm packagaes
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var database = require('./database.js');
var config = require('./config.json');

var parser = bodyParser.urlencoded({ extended: false });

app.get('/SignUp', function(req, res){
  res.sendFile('/SignUp/index.html', {root: __dirname });
});

app.post('/SignUp', parser, function(request, response){
    if(request.body.password === request.body.confirmPassword){
        database.createNewUser(request.body.username, request.body.password, request.body.email)
        .then(function(result){
            response.send('<h1>Nice Job!</h1>');
        })
        .catch(function(e) {
          if(e.name === 'SequelizeUniqueConstraintError') {
            response.send('<h1>Username taken</h1>');
          }
          else throw e;
        });
    }
    else{
        response.send('<h1>Your passwords do not match. Please try again.</h1>');
    }
});

var server = app.listen(config.port, config.server, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
