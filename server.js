require('babel-register');
// Dependencies
var        request = require('request');
var        cheerio = require('cheerio');
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

  //////////////
 // Homepage //
//////////////

// GET
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
    subQuery: false
  }).then( results => {
    console.log(results[0].toJSON())
    
    var homepage = layout.renderPage( 
      layout.HomePage({posts: results, loggedIn: request.loggedIn}), 'Reddit Clone'
    );
    
    response.status(200).send(homepage);
  }).catch( err => {
    console.log(err);
    response.status(500).send("Unexpected error occured...");
  });
});

  ///////////
 // Login //
///////////

// GET
app.get('/login', function(request, response) {
  if (request.loggedIn) {
    response.send('already logged in');
  }
  else {
    var login = layout.renderPage( layout.Login(), 'Login' );
    
    response.status(200).send(login);
  }
});

// POST
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

  ////////////
 // Logout //
////////////

// POST
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

  ////////////
 // Signup //
////////////

// GET
app.get('/signup', function(request, response) {
  if (request.loggedIn) {
    response.send('already logged in');
  }
  else {
    var signup = layout.renderPage( layout.Signup(), 'Sign up' );
    
    response.status(200).send(signup);
  }
});

// POST
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

  ////////////////////
 // Create content //
////////////////////

// GET
app.get('/create-content', function(request, response) {
  if (request.loggedIn) {
    var createContent = layout.renderPage( layout.CreateContent(), 'Create a post' );
    
    response.status(200).send(createContent);
  }
  else {
    response.status(400).response(`Can't post if not logged in!`);
  }  
});

// POST
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

  /////////////////////
 // Vote on content //
/////////////////////

// POST
app.post('/vote', function(request, response) {
  if (request.loggedIn) {
    var user = request.loggedIn;
    var contentID = request.body.contentID;
    var isUpVote = request.body.upvote ? true : false;
    
    db.Content.findById(contentID)
    .then( content => user.addUpVotes(content, {upVote: isUpVote}) )
    .then( () => response.status(303).redirect(request.headers.referer || '/') );    
  }
  else {
    response.status(400).response(`Can't vote if not logged in!`);
  }   
});

  ///////////////////
 // Suggest title //
///////////////////

// GET
app.get('/suggest', function(req, res) {
    var url = req.query.url;

    request(url, (err, response, body) => {
      if (!err && res.statusCode === 200) {
        var $ = cheerio.load(body);

        res.status(200).send($('title').text());
      }
    });
});


// Listen
app.listen(process.env.PORT);