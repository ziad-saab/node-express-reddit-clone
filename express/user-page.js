var database = require('../database/database.js');
var app = require('./app.js');
var parseReact = require('./react-parser.js').parseReact;
var UserPage = require('../react/react-user-page.js')
var send404 = require('./404.js');
var PAGE_LENGTH = 10;
app.get('/user/:username', function(req, res){
  var sessionId = req.cookies.sessionId;
  var username = req.params.username;
  database.getCommentsAndScoresForUser(sessionId, username, PAGE_LENGTH, 0)
  .then(function(resp) {
    res.send(parseReact(UserPage(resp.user, username, resp.comments, resp.commentScores, 0, PAGE_LENGTH)));
  })
  .catch(function(e) {
    send404(req, res);
  });
});


app.get('/user/:username/:page', function(req, res){
  var sessionId = req.cookies.sessionId;
  var page = parseInt(req.params.page);
  if (isNaN(page)) {
    send404(req, res);
    return;
  }
  var username = req.params.username;
  database.getCommentsAndScoresForUser(sessionId, username, PAGE_LENGTH, page*PAGE_LENGTH)
  .then(function(resp) {
    res.send(parseReact(UserPage(resp.user, username, resp.comments, resp.commentScores, page, PAGE_LENGTH)));
  })
  .catch(function(e) {
    send404(req, res);
  });
});
