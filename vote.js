var app = require('./app.js');

app.get('/upvote/:sessionId', function(req, res){
  console.log(sessionId);
});
app.get('/downvote/:sessionId', function(req, res){
  console.log(sessionId);
});
