//Requiring npm packagaes
var app = require('./app.js');
var database = require('./database.js');
require('./createuser.js');
require('./login.js');
require('./createcontent.js');

app.get('/', function(req, res){
  database.getLatestNContent(25)
  .then(function(content) {
    res.send(htmlify(content));
  });
});

function htmlify(contents) {
  var htmlstring = '<a href=/SignUp>Sign Up</a>\
    <a href=/Login>Login</a>\
    <a href=/CreateContent>Create Content</a>\
    <div id="contents">\
    <h1>List of contents</h1>\
    <ul class="contents-list">';
  contents.forEach(function(content) {
    htmlstring += '<li class="content-item"> \
      <h2 class="' + content.title + '"> \
        <a href="' + content.url + '">' + content.title + '</a> \
      </h2> \
      <p>Created by ' + content.user.username + '</p> \
    </li>';
  });
  htmlstring += '</ul> \
  </div>';
  return htmlstring;
}
