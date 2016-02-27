var database = require('../database/database.js');
var app = require('./app.js');
var parseReact = require('./react-parser.js').parseReact;
var Comments = require('../react/react-comments-page.js');
var send404 = require('./404.js')

app.get('/link/:contentId/comments',function(req, res) {
  var contentId = parseInt(req.params.contentId);
  if (isNaN(contentId)) {
    send404(req, res);
    return;
  }
  var sessionId = req.cookies.sessionId;
  database.getContentAndComments(sessionId, contentId, null)
  .then(function(response) {
    res.send(parseReact(Comments(response.user, response.submitter, response.content, response.comments, response.vote, response.votescore, response.commentScores, false)));
  });
});

app.get('/link/:contentId/comments/:commentId',function(req, res) {
  var contentId = parseInt(req.params.contentId);
  var commentId = parseInt(req.params.commentId);
  if (isNaN(contentId) || isNaN(commentId)) {
    send404(req, res);
    return;
  }
  var sessionId = req.cookies.sessionId;
  database.getContentAndComments(sessionId, contentId, commentId)
  .then(function(response) {
    res.send(parseReact(Comments(response.user, response.submitter, response.content, response.comments, response.vote, response.votescore, response.commentScores, true)));
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
  }).catch(function(e){
    res.sendStatus(401);
  });
});
