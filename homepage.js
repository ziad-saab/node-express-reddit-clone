//Requiring npm packagaes
var ejs = require('ejs');
var app = require('./app.js');
var database = require('./database/database.js');
require('babel-register');
var ReactDOMServer = require('react-dom/server');
var HomePage = require('./react-homepage');
const PAGE_LENGTH = 20;

app.get('/', function(req, res){
  res.redirect('/sort/hot/0');
});

app.get('/sort/:order', function(req, res){
  res.redirect('/sort/' + req.params.order + '/0');
});

function getFunction(type) {
  switch(type) {
    case 'hot':
    return database.getHottestNContent;
    break;
    case 'controversial':
    return database.getControversialNContent;
    break;
    case 'top':
    return database.getTopNContent;
    break;
    case 'latest':
    return database.getLatestNContent;
    break;
  }
}

app.get('/sort/:order/:page', function(req, res){
  var sessionId = req.cookies.sessionId;
  var page = parseInt(req.params.page);
  if (isNaN(page))
  page = 0;
  getFunction(req.params.order)(sessionId, PAGE_LENGTH, page*PAGE_LENGTH)
  .then(function(response) {
    var username;
    try {username = response.User.username} catch(e) {}
    var htmlStructure = HomePage(username, response.Content, req.params.order, page);
    var html = ReactDOMServer.renderToStaticMarkup(htmlStructure);
    res.send('<!doctype html>' + html);
  });
});
