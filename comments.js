var database = require('./database/database.js');
var app = require('./app.js');
var ReactDOMServer = require('react-dom/server');
require('babel-register');
var Comments = require('./react-comments.js');

app.get('/link/:contentId/comments',function(req, res) {
  var contentId = parseInt(req.params.contentId);
  var sessionId = req.cookies.sessionId;
  database.getContentAndComments(sessionId, contentId)
  .then(function(response) {
    var htmlStructure = Comments(response.user, response.content, response.comments);
    var html = ReactDOMServer.renderToStaticMarkup(htmlStructure);
    res.send('<!doctype html>' + html);
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
app.post('/comment/', function(req, res) {
  var contentId = parseInt(req.body.contentId);
  var commentId = req.body.commentId;
  if (commentId)
  commentId = parseInt(commentId);
  var comment = req.body.text;
  var sessionId = req.cookies.sessionId;
  database.createNewComment(sessionId, contentId, commentId, comment)
  .then(function(comment) {
    res.send(comment);
  });
});
