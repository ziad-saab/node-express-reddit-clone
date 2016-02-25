var app = require('./app.js');
var database = require('../database/database.js');
var ReactDOMServer = require('react-dom/server');
require('babel-register');

app.post('/Login', function(request, response){
    database.login(request.body.username, request.body.password)
    .then(function(token){
        if(token){
            response.cookie('sessionId', token);
            response.redirect(request.get('referer'));
        }
    })
    .catch(function(e){
        if(e.message === database.INVALID_PASSWORD || e.message === database.USR_NOT_FOUND){
            response.redirect('/Login?error=Invalid Username or Password');
        }
        else throw e;
    });
});


app.get('/Logout', function(req, res){
  res.cookie('sessionId', undefined);
  res.redirect(req.get('referer'));
});
