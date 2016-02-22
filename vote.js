var app = require('./app.js');
var database = require('./database/database.js');

app.post('/upvote/:contentId', function(req, res){
  database.voteOnContent(req.cookies.sessionId, req.params.contentId, true).then(function(resp) {
    res.redirect(req.get('referer'));
  });
});
app.post('/downvote/:contentId', function(req, res){
  database.voteOnContent(req.cookies.sessionId, req.params.contentId, false).then(function(resp) {
    res.redirect(req.get('referer'));
  });
});
