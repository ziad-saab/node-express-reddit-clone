var database = require('../database/database.js');
var app = require('./app.js');
var parseReact = require('./react-parser.js').parseReact;
var UserPage = require('../react/react-user-page.js')

app.get('/user/:username', function(req, res){
  var sessionId = req.cookies.sessionId;
  var username = req.params.username;
  database.getCommentsAndScoresForUser(sessionId, username, 10, 0)
  .then(function(resp) {
    res.send(parseReact(UserPage(resp.user, resp.comments, resp.commentScores)));
  });
});
