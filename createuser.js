//Requiring npm packagaes
var database = require('./database/database.js');
var app = require('./app.js');
var ReactDOMServer = require('react-dom/server');
require('babel-register');
var SignUp = require('./react-signup');

app.get('/SignUp', function(req, res){
  var htmlStructure = SignUp(req.query.error);
  var html = ReactDOMServer.renderToStaticMarkup(htmlStructure);
  res.send('<!doctype html>' + html);
});


app.post('/SignUp', function(request, response){
    if(request.body.password === request.body.confirmpassword){
        database.createNewUser(request.body.username, request.body.password, request.body.email)
        .then(function(result){
            database.login(request.body.username, request.body.password)
            .then(function(token){
                if(token){
                    response.cookie('sessionId', token);
                    response.redirect('/');
                }
                return token;
            });
        })
        .catch(function(e) {
          if(e.name === 'SequelizeUniqueConstraintError') {
            response.redirect('/SignUp?error=Username Taken');
          }
          else throw e;
        });
    }
    else{
        response.redirect('/SignUp?error=Your passwords do not match');
    }
});
