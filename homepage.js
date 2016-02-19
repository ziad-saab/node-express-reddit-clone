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
  res.redirect('/0');
});

app.get('/:page', function(req, res){
  var sessionId = req.cookies.sessionId;
  var page = parseInt(req.params.page) * PAGE_LENGTH;
  if (isNaN(page))
  page = 0;
  database.getHottestNContent(sessionId, PAGE_LENGTH, page)
  .then(function(response) {
    var username;
    try {username = response.User.username} catch(e) {}
    res.render('homepage', {user: username, contentList: response.Content, page: page, type: ''});
  });
});

app.get('/controversial/:page', function(req, res){
  var sessionId = req.cookies.sessionId;
  var page = parseInt(req.params.page) * PAGE_LENGTH;
  if (isNaN(page))
  page = 0;
  database.getControversialNContent(sessionId, PAGE_LENGTH, page)
  .then(function(response) {
    var username;
    try {username = response.User.username} catch(e) {}
    res.render('homepage', {user: username, contentList: response.Content, page: page, type: 'controversial'});
  });
});

app.get('/top/:page', function(req, res){
  var sessionId = req.cookies.sessionId;
  var page = parseInt(req.params.page) * PAGE_LENGTH;
  if (isNaN(page))
  page = 0;
  database.getTopNContent(sessionId, PAGE_LENGTH, page)
  .then(function(response) {
    var username;
    try {username = response.User.username} catch(e) {}
    res.render('homepage', {user: username, contentList: response.Content, page: page, type: 'top'});
  });
});

app.get('/latest/:page', function(req, res){
  var sessionId = req.cookies.sessionId;
  var page = parseInt(req.params.page) * PAGE_LENGTH;
  if (isNaN(page))
  page = 0;
  database.getLatestNContent(sessionId, PAGE_LENGTH, page)
  .then(function(response) {
    var username;
    try {username = response.User.username} catch(e) {}
    res.render('homepage', {user: username, contentList: response.Content, page: page, type: 'latest'});
  });
});
