var app = require('./app.js');
var database = require('./database.js');
app.get('/Login', function(req, res){
  res.sendFile('/Login/index.html', {root: __dirname });
});

app.post('/Login', function(request, response){
    database.login(request.body.username, request.body.password)
    .then(function(token){
        if(token){
            response.cookie('sessionId', token);
            response.redirect('/');
        }
    })
    .catch(function(e){
        if(e.message === database.INVALID_PASSWORD || e.message === database.USR_NOT_FOUND){
            response.send(e.message);
        }
        else throw e;
    });
});
