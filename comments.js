var database = require('./database.js');
var app = require('./app.js');

app.get('/link/:contentId/comments',function(req, res) {
  var contentId = parseInt(req.params.contentId);
  var sessionId = req.cookies.sessionId;
  database.getContentAndComments(sessionId, contentId)
  .then(function(response) {
    res.render('comments-page', {user: response.user, comments: response.comments});
  });
});
