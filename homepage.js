//Requiring npm packagaes
var ejs = require('ejs');
var app = require('./app.js');
var database = require('./database.js');
require('./createuser.js');
require('./login.js');
require('./createcontent.js');
require('./vote.js');

app.get('/', function(req, res){
  var sessionId = req.cookies.sessionId;
  database.getControversialNContent(sessionId, 25)
  .then(function(response) {
    var username;
    try {username = response.User.username} catch(e) {}
    res.render('homepage', {user: username, contentList: response.Content});
  });
});
