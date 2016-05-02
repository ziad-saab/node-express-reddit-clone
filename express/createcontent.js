var app = require('./app.js');
var database = require('../database/database.js');
var parseReact = require('./react-parser.js').parseReact;
var CreateContent = require('../react/react-createcontent');

app.get('/CreateContent', function(req, res){
  database.getUserFromSessionId(req.cookies.sessionId)
  .then(function(user){
    res.send(parseReact(CreateContent(user.username, req.query.error)));
  })
  .catch(function(e){
    res.send(parseReact(CreateContent(null, req.query.error)));
  })
});

app.post('/CreateContent', function(request, response){
    database.postContent(request.cookies.sessionId, request.body.url, request.body.title)
    .then(function(result){
        console.log(result);
        database.voteOnContent(request.cookies.sessionId, result.dataValues.id, true)
        .then(function(result){
            //redirect to content page
             response.redirect("/");
        });
    })
    .catch(function(e){
      if(e.message === database.INVALID_SESSIONID){
        var error = "You are not logged in";
        response.send(parseReact(CreateContent(null, error)));
      }
      else throw e;
    });
});
