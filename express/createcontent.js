var app = require('./app.js');
var database = require('../database/database.js');
var ReactDOMServer = require('react-dom/server');
require('babel-register');
var CreateContent = require('../react/react-createcontent');

app.get('/CreateContent', function(req, res){
  var htmlStructure = CreateContent(req.query.error);
  var html = ReactDOMServer.renderToStaticMarkup(htmlStructure);
  res.send('<!doctype html>' + html);
});

app.post('/CreateContent', function(request, response){
    console.log(request.body);
    database.postContent(request.cookies.sessionId, request.body.url,  request.body.title)
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
      response.redirect('/CreateContent/?error=You are not logged in');
      }
      else throw e;
    });
});
