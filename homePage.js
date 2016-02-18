//Requiring npm packagaes
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var database = require('./database.js');
var config = require('./config.json');

var parser = bodyParser.urlencoded({ extended: false });

var port = config.port;
if(!port)
port = process.env.PORT;
var ip = config.server;
if (!ip)
ip = process.env.IP;

app.get('/homepage', function(req, res){
  database.getLatestNContent(25)
  .then(function(content) {
    res.send(htmlify(content));
  });
});

function htmlify(content) {
  var htmlstring = '<div id="contents"> \
  <h1>List of contents</h1> \
  <ul class="contents-list">';
  contentArray.forEach(function(content) {
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

var server = app.listen(port, ip, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
