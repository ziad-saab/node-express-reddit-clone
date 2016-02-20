var database = require('./database/database.js');
var app = require('./app.js');

app.get('/link/:contentId/comments',function(req, res) {
  var contentId = parseInt(req.params.contentId);
  var sessionId = req.cookies.sessionId;
  database.getContentAndComments(sessionId, contentId)
  .then(function(response) {
    res.render('comments-page', {user: response.user, content: response.content, comments: response.comments});
  });
});

app.post('/comment/:contentId', function(req, res) {
  var contentId = parseInt(req.params.contentId);
  var sessionId = req.cookies.sessionId;
  database.createNewComment(sessionId, contentId, null, req.body.comment)
  .then(function(comment) {
    res.redirect('/link/'+contentId+'/comments');
  })
  .catch(function(e) {
    if(e === database.INVALID_SESSIONID)
    res.redirect('/Login');
  });
});
