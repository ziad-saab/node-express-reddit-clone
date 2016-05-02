//Requiring npm packagaes
var jquery = require('jquery');
var app = require('./app.js');
var database = require('../database/database.js');
var parseReact = require('./react-parser.js').parseReact;
var HomePage = require('../react/react-homepage');
var send404 = require('./404.js')
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
  if (isNaN(page)) {
    send404(req, res);
    return;
  }
  var orderFunction = getFunction(req.params.order);
  if(!orderFunction) {
    send404(req, res);
    return;
  }
  orderFunction(sessionId, PAGE_LENGTH, page*PAGE_LENGTH)
  .then(function(response) {
    var username;
    try {username = response.User.username} catch(e) {}
    res.send(parseReact(HomePage(username, response.Content, req.params.order, page, PAGE_LENGTH)));
  });
});
