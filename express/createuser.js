//Requiring npm packagaes
var database = require('../database/database.js');
var app = require('./app.js');
var ReactDOMServer = require('react-dom/server');
require('babel-register');

app.post('/SignUp', function(request, response){
  database.createNewUser(request.body.username, request.body.password, request.body.email)
  .then(function(result){
      database.login(request.body.username, request.body.password)
      .then(function(token){
          if(token){
              response.cookie('sessionId', token);
              response.redirect(request.get('referer'));
          }
      });
  })
  .catch(function(e) {
    if(e.name === 'SequelizeUniqueConstraintError') {
      response.status(400).send('Username Taken');
    }
    else throw e;
  });


});
