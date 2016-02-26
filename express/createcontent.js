var app = require('./app.js');
var database = require('../database/database.js');
var ReactDOMServer = require('react-dom/server');
require('babel-register');
var CreateContent = require('../react/react-createcontent');

app.get('/CreateContent', function(req, res){
  database.getUserFromSessionId(req.cookies.sessionId)
  .then(function(user){
    var htmlStructure = CreateContent(user.username, req.query.error);
    var html = ReactDOMServer.renderToStaticMarkup(htmlStructure);
    res.send('<!doctype html>' + html);
  })
  .catch(function(e){
    var htmlStructure = CreateContent(null, req.query.error);
    var html = ReactDOMServer.renderToStaticMarkup(htmlStructure);
    res.send('<!doctype html>' + html);
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
        var htmlStructure = CreateContent(null, error);
        var html = ReactDOMServer.renderToStaticMarkup(htmlStructure);
        response.send('<!doctype html>' + html);
      }
      else throw e;
    });
});
