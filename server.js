// Dependencies
var      express = require('express');
var   bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var    Sequelize = require('sequelize');
var secureRandom = require('secure-random');
var         util = require('util');
var           db = require('./data-model');
var       bcrypt = require('bcrypt');

var sendFileOptions = { root: '/home/ubuntu/workspace/' };

function createToken() {
    return secureRandom.randomArray(40).map(code => code.toString(16)).join('')
}


//intialize express
var app = express();

// Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
// custom middleware to check if user is logged in
app.use( (req, res, next) => {
  if (req.cookies.session) {
    db.Session.findOne({
      where: {token: req.cookies.session},
      include: db.User
    });
  }
});

// Resources
app.get('/', function(request, response) {
  // code for the homepage
});

// Login
app.get('/login', function(request, response) {
  response.sendFile('login.html', sendFileOptions);
});

app.post('/login', function(request, response) {
  var name = request.body.username;
  var pass = request.body.password;
  
  db.User.findOne({
    where: { username: name }
  })
  .then( 
    user => {
      if (bcrypt.compareSync(pass, user.dataValues.passhash)) {
        return user.createSession({
          token: createToken()
        })
        .then( session => {
          response.cookie('session', session.dataValues.token);
          response.status(303).redirect('/');
        });
      }
      else {
        throw new Error("Invalid password!");
      }
    }
  )
  .catch( () => response.send('Unexpected error occurred'));
});

// Signup
app.get('/signup', function(request, response) {
  // code to display signup form
});

app.post('/signup', function(request, response) {
  // code to signup a user
  // ihnt: you'll have to use bcrypt to hash the user's password
});

// Create content
app.get('/create-content', function(request, response) {
  
});

app.post('/create-content', function(request, response) {
    
});

app.post('/vote', function(request, response) {
  // code to add an up or down vote for a content+user combination
});


// Listen
app.listen(process.env.PORT);
