// This file is ONLY meant as an example "structure"

// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Sequelize = require('sequelize');

// Middleware
app.use(bodyParser.urlencoded());
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
