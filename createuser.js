//Requiring npm packagaes
var database = require('./database.js');
var app = require('./app.js');



var signupGet = app.get('/SignUp', function(req, res){
  res.sendFile('/SignUp/index.html', {root: __dirname });
});


var signupPost = app.post('/SignUp', function(request, response){
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

module.exports = {
  signupGet: signupGet,
  signupPost: signupPost
};
