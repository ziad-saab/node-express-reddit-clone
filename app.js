var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config.json');
var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine','ejs');
app.use(express.static("public"));

var port = config.port;
if(!port)
port = process.env.PORT;
var ip = config.server;
if (!ip)
ip = process.env.IP;

var server = app.listen(port, ip, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

module.exports = app;
