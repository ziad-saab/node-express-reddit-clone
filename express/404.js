var database = require('../database/database.js');
var parseReact = require('./react-parser.js').parseReact;
var page404 = require('../react/react-404.js');

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
