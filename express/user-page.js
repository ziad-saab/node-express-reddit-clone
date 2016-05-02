var database = require('../database/database.js');
var app = require('./app.js');
var parseReact = require('./react-parser.js').parseReact;
var UserPage = require('../react/react-user-page.js')
var UserSubmissionPage = require('../react/react-user-content-page.js')
var send404 = require('./404.js');
var PAGE_LENGTH = 20;

app.get('/user/:username', function(req, res){
  res.redirect(`/user/${req.params.username}/submissions/0`);
});


app.get('/user/:username/comments/:page', function(req, res){
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


app.get('/user/:username/submissions/:page', function(req, res){
  var sessionId = req.cookies.sessionId;
  var page = parseInt(req.params.page);
  if (isNaN(page)) {
    send404(req, res);
    return;
  }
  var username = req.params.username;
  database.getLatestNContentForUser(sessionId, username, PAGE_LENGTH, page*PAGE_LENGTH)
  .then(function(resp) {
    var user;
    try {user = resp.User.username} catch(e) {}
    res.send(parseReact(UserSubmissionPage(user, username, resp.Content, page, PAGE_LENGTH)));
  })
  .catch(function(e) {
    send404(req, res);
  });
});
