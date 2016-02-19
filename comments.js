var database = require('./database.js');
var app = require('./app.js');

app.get('/link/:contentId/comments',function(req, res) {
  var contentId = parseInt(req.params.contentId);
  console.log(contentId);
  database.getContentAndComments(contentId)
  .then(function(response) {
    res.render('comments-page', {comments: response.comments});
  });
});
