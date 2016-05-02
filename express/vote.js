var app = require('./app.js');
var database = require('../database/database.js');

app.post('/upvote/', function(req, res){
  database.voteOnContent(req.cookies.sessionId, req.body.contentId, true).then(function(resp) {
    res.redirect(req.get('referer'));
  }).catch(function(e){
    res.sendStatus(401);
  });
});
app.post('/downvote/', function(req, res){
  database.voteOnContent(req.cookies.sessionId, req.body.contentId, false).then(function(resp) {
    res.redirect(req.get('referer'));
  }).catch(function(e){
    res.sendStatus(401);
  });
});
