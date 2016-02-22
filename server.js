require('babel-register');
// Dependencies
var        express = require('express');
var     bodyParser = require('body-parser');
var   cookieParser = require('cookie-parser');
var      Sequelize = require('sequelize');
var            col = Sequelize.col;
var             fn = Sequelize.fn;
var   secureRandom = require('secure-random');
var           util = require('util');
var             db = require('./data-model');
var         bcrypt = require('bcrypt');
var         layout = require('./layout');

var sendFileOptions = { root: '/home/ubuntu/workspace/' };

function createToken() {
    return secureRandom.randomArray(40).map(code => code.toString(16)).join('')
}


//intialize express
var app = express();
// Middleware
app.use(express.static('static'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
// custom middleware to check if user is logged in
app.use( (req, res, next) => {
  if (req.cookies.session) {
    db.Session.findOne({
      where: {token: req.cookies.session},
      include: db.User
    })
    .then( session => {
      if (session) {
        req.loggedIn = session.user;
        next();
      }
    })
  }
  else {
    next();
  }
});

  ///////////////
 // Resources //
///////////////
app.get('/', function(request, response) {
  var sort = request.query.sort || 'top';
  var score;
  var voteDiff = fn('SUM', fn('IF', col('votes.upVote'), 1, -1));
  var dateDiff = Sequelize.literal('(TIMESTAMPDIFF(SECOND, NOW(), content.createdAt) / 1000000)');

  switch (sort) {
    case 'top': 
      score = voteDiff;
      break;
    case 'hot':
      score = Sequelize.condition(voteDiff, '/', dateDiff);
      score = Sequelize.condition(score, '*', Sequelize.literal('-1'));
      break;
    case 'new':
      score = dateDiff;
      break;
    case 'controversial':
      break;
  }

  db.Content.findAll({
    include: [db.User, db.Vote],
    group: 'content.id',
    attributes: {
      include: [
        [score, 'voteScore'],
        [voteDiff, 'voteDiff']
      ]
    },
    order: [Sequelize.literal('voteScore DESC, id')],
    limit: 25,
    subQuery: false
  }).then( results => {

    var body = layout.HomePage({
      posts: results,
      loggedIn: request.loggedIn
    });

    response.status(200).send(layout.renderPage(body, 'Reddit Clone'));
    
  }).catch( err => {
    console.log(err);
    response.status(500).send("Unexpected error occured...");
  });
});


// Login
app.get('/login', function(request, response) {
  if (request.loggedIn) {
    response.send('already logged in');
  }
  else {
    response.status(200).sendFile('login.html', sendFileOptions);
  }
});

app.post('/login', function(request, response) {
  if (request.loggedIn) {
    response.send('already logged in');
    return;
  }
  
  var name = request.body.username;
  var pass = request.body.password;
  
  db.User.findOne({
    where: { username: name }
  })
  .then( user => {
    if (user) {
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
    else {
      throw new Error("No such user exists!");
    }
  })
  .catch( err => {
    console.log(err);
    response.status(500).send('Unexpected error occurred');
  });
});


// Logout
app.get('/logout', function(request, response) {
  if (request.loggedIn) {
    response.status(200).sendFile('logout.html', sendFileOptions);
  }
  else {
    response.status(400).send(`not logged in! can't log out!`);
  }  
});

app.post('/logout', function(request, response) {
  if (request.loggedIn) {
    db.Session.findOne({
      where: {token: request.cookies.session}
    })
    .then( session => {
      if (session) {
        session.destroy()
        .then( () => response.clearCookie('session'))
        .then( () => response.status(303).redirect('/'));
      }
      else {
        response.status(400).send('Error');
      }
    })
  }
  else {
    response.status(400).send(`not logged in! can't log out!`);
  }
});


// Signup
app.get('/signup', function(request, response) {
  if (request.loggedIn) {
    response.send('already logged in');
  }
  else {
    response.status(200).sendFile('signup.html', sendFileOptions);
  }
});

app.post('/signup', function(request, response) {
  if (request.loggedIn) {
    response.send('already logged in');
    return;
  }
  
  var name = request.body.username;
  var pass = request.body.password;
  var passConfirm = request.body.passwordConfirm;
  
  if (pass !== passConfirm) {
    response.send("passwords don't match!");
    return;
  }
  
  db.User.create({
    username: name,
    password: pass
  })
  .then( user => {
    if (user) {
      return user.createSession({
        token: createToken()
      })
    }
  })
  .then( session => {
    response.cookie('session', session.dataValues.token);
    response.status(303).redirect('/');
  })
  .catch( err => {
    console.log(err);
    response.status(500).send('Unexpected error occured!!!');
  });
});


// Create content
app.get('/create-content', function(request, response) {
  if (request.loggedIn) {
    response.status(200).sendFile('create-content.html', sendFileOptions);
  }
  else {
    response.status(400).response(`Can't post if not logged in!`);
  }  
});

app.post('/create-content', function(request, response) {
  if (request.loggedIn) {
    var user = request.loggedIn;
    var title = request.body.title;
    var url = request.body.url;
    
    user.createContent({
      title: title,
      url: url
    })
    .then( () => response.status(303).redirect('/'));
  }
  else {
    response.status(400).response(`Can't post if not logged in!`);
  }     
});


// Vote on content
app.post('/vote', function(request, response) {
  if (request.loggedIn) {
    var user = request.loggedIn;
    var contentID = request.body.contentID;
    var isUpVote = request.body.upvote ? true : false;
    
    db.Content.findById(contentID)
    .then( content => user.addUpVotes(content, {upVote: isUpVote}) )
    .then( () => response.status(303).redirect('/') );    
  }
  else {
    response.status(400).response(`Can't vote if not logged in!`);
  }   
});


// Listen
app.listen(process.env.PORT);