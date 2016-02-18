var app = require('./app.js');
var database = require('./database.js');

app.get('/CreateContent', function(req, res){
    res.render('createcontent-form', {error: req.query.error});
});

app.post('/CreateContent', function(request, response){
    console.log(request.body);
    database.postContent(request.cookies.sessionId, request.body.title,  request.body.url)
    .then(function(result){
        //redirect to content page
        response.redirect("/");
    })
    .catch(function(e){
      if(e.message === database.INVALID_SESSIONID){
      response.redirect('/CreateContent/?error=You are not logged in');
      }
      else throw e;
    });
});
