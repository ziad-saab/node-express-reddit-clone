var app = require('./app.js');
var database = require('../database/database.js');

app.post('/commentupvote/', function(req, res){
  database.voteOnComment(req.cookies.sessionId, req.body.commentId, true)
  .then(function(resp) {
    res.redirect(req.get('referer'));
  }).catch(function(e){
    res.sendStatus(401);
  });
});
app.post('/commentdownvote/', function(req, res){
  database.voteOnComment(req.cookies.sessionId, req.body.commentId, false)
  .then(function(resp) {
    res.redirect(req.get('referer'));
  }).catch(function(e){
    res.sendStatus(401);
  });
});
