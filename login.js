var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var database = require('./database.js');
var config = require('./config.json');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

var parser = bodyParser.urlencoded({ extended: false });

app.get('/Login', function(req, res){
  res.sendFile('/Login/index.html', {root: __dirname });
});

app.post('/Login', parser, function(request, response){
    database.login(request.body.username, request.body.password)
    .then(function(token){
        response.send("You are now logged in with token: " + token);
        //need to add code to use the token for the login session
    })
    .catch(function(e){
        if(e.message === 'Invalid password' || e.message === 'User not found'){
            response.send(e.message);
        }
        else throw e;
    });
});

var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
