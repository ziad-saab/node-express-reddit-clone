//Requiring npm packagaes
var database = require('./database.js');
var app = require('./app.js');

app.get('/SignUp', function(req, res){
  res.render('signup-form', {error: req.query.error});
});


app.post('/SignUp', function(request, response){
    if(request.body.password === request.body.confirmPassword){
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
        response.send('<h1>Your passwords do not match. Please try again.</h1>');
    }
});
