var database = require('../database/database.js');
var parser = require('./react-parser.js');
var page404 = require('../react/react-404.js');

var parseReact = parser.parseReact;

function send404(request, response) {
  database.getUserFromSessionId(request.cookies.sessionId)
  .then(function(user) {
    response.status(404).send(parseReact(page404(user.username)));
  })
  .catch(function(e) {
    response.status(404).send(parseReact(page404(undefined)));
  })
}

module.exports = send404;
