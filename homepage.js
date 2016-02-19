//Requiring npm packagaes
var ejs = require('ejs');
var app = require('./app.js');
var database = require('./database.js');
require('./createuser.js');
require('./login.js');
require('./createcontent.js');
require('./vote.js');
require('./comments.js');

const PAGE_LENGTH = 5;

app.get('/', function(req, res){
  res.redirect('/hot/0');
});
app.get('/:order', function(req, res){
  res.redirect('/' + req.params.order + '/0');
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
app.get('/:order/:page', function(req, res){
  var sessionId = req.cookies.sessionId;
  var page = parseInt(req.params.page);
  if (isNaN(page))
  page = 0;
  getFunction(req.params.order)(sessionId, PAGE_LENGTH, page*PAGE_LENGTH)
  .then(function(response) {
    var username;
    try {username = response.User.username} catch(e) {}
    res.render('homepage', {user: username, contentList: response.Content, page: page, type: req.params.order});
  });
});
