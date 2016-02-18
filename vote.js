var app = require('./app.js');
var database = require('./database.js');

app.get('/upvote/:contentId', function(req, res){
  database.voteOnContent(req.cookies.sessionId, req.params.contentId, true).then(function(resp) {
    res.redirect('/');
  });
});
app.get('/downvote/:contentId', function(req, res){
  database.voteOnContent(req.cookies.sessionId, req.params.contentId, false).then(function(resp) {
    res.redirect('/');
  });
});
