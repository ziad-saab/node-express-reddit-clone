var app = require('./app.js');
var database = require('./database.js');

app.get('/CreateContent', function(req, res){
    res.sendFile('/CreateContent/index.html', {root: __dirname });
});

app.post('/CreateContent', function(request, response){
    console.log(request.cookies);
    database.postContent(request.cookies.sessionId, request.body.title,  request.body.url)
    .then(function(result){
        //redirect to content page
        response.send("Content Page");
    })
    .catch(function(e){
      if(e.message === database.INVALID_SESSIONID)
      response.send("You are not logged in!!!");

      else throw e;
    });
});
