//require pages that will respond to gets and posts
var app = require('./express/app.js');
require('./express/homepage.js');
require('./express/createuser.js');
require('./express/login.js');
require('./express/createcontent.js');
require('./express/vote.js');
require('./express/commentvote.js');
require('./express/comments-page.js');
require('./express/user-page.js');

var send404 = require('./express/404.js');

app.get('*', function(req, res){
  send404(req, res);
});
