// Dependencies
var      express = require('express');
var   bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var           db = require('./data-model');
var    Sequelize = require('sequelize');

//intialize express
var app = express();

// Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Resources
app.get('/', function(request, response) {
  // code for the homepage
});

app.get('/login', function(request, response) {
  // code to display login form
});

app.post('/login', function(request, response) {
  // code to login a user
  // hint: you'll have to use response.cookie here
});

app.get('/signup', function(request, response) {
  // code to display signup form
});

app.post('/signup', function(request, response) {
  // code to signup a user
  // ihnt: you'll have to use bcrypt to hash the user's password
});

app.post('/vote', function(request, response) {
  // code to add an up or down vote for a content+user combination
});


// Listen
app.listen(process.env.PORT);
