var app = require('./app.js');
var database = require('./database/database.js');

app.post('/upvote/:order/:contentId', function(req, res){
  database.voteOnContent(req.cookies.sessionId, req.params.contentId, true).then(function(resp) {
    res.redirect('/'+req.params.order);
  });
});
app.post('/downvote/:order/:contentId', function(req, res){
  database.voteOnContent(req.cookies.sessionId, req.params.contentId, false).then(function(resp) {
    res.redirect('/'+req.params.order);
  });
});
