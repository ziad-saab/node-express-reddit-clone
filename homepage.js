//Requiring npm packagaes
var ejs = require('ejs');
var app = require('./app.js');
var database = require('./database.js');
require('./createuser.js');
require('./login.js');
require('./createcontent.js');
require('./vote.js');

const PAGE_LENGTH = 5;

app.get('/', function(req, res){
  var sessionId = req.cookies.sessionId;
  database.getLatestNContent(sessionId, PAGE_LENGTH, 0)
  .then(function(response) {
    var username;
    try {username = response.User.username} catch(e) {}
    res.render('homepage', {user: username, contentList: response.Content});
  });
});

app.get('/:page', function(req, res){
  var sessionId = req.cookies.sessionId;
  var page = parseInt(req.params.page);
  if (isNaN(page))
  page = 0;
  database.getControversialNContent(sessionId, PAGE_LENGTH, page)
  .then(function(response) {
    var username;
    try {username = response.User.username} catch(e) {}
    res.render('homepage', {user: username, contentList: response.Content});
    console.log(response.Content);
  });
});
