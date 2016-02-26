require('babel-register');
// Dependencies
var              _ = require('lodash');
var        request = require('request');
var        cheerio = require('cheerio');
var        express = require('express');
var     bodyParser = require('body-parser');
var   cookieParser = require('cookie-parser');
var      Sequelize = require('sequelize');
var            col = Sequelize.col;
var             fn = Sequelize.fn;
var        literal = Sequelize.literal;
var      condition = Sequelize.condition;
var   secureRandom = require('secure-random');
var         bcrypt = require('bcrypt');
var             db = require('./data-model');
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
  var voteDiff = fn('SUM', fn('COALESCE', col('votes.voteValue'), 0));
  var dateDiff = literal('(TIMESTAMPDIFF(SECOND, NOW(), content.createdAt) / 1000000)');

  switch (sort) {
    case 'top':
      score = voteDiff;
      break;
    case 'hot':
      score = condition(voteDiff, '/', dateDiff);
      score = condition(score, '*', literal('-1'));
      break;
    case 'new':
      score = dateDiff;
      break;
    case 'controversial':
      break;
  }

  db.Content.findAll({
    include:  [ { model: db.User, attributes: ['username'] },
                { model: db.Vote, attributes: [] },
                { model: db.Vote,
                  as: 'loggedInVote',
                  attributes: ['voteValue'],
                  where: { userId: request.loggedIn && request.loggedIn.dataValues.id || null},
                  required: false
                }
              ],
    group: 'content.id',
    attributes: {
      include: [
        [score, 'voteScore'],
        [voteDiff, 'voteDiff']
      ]
    },
    order: [literal('voteScore DESC, id')],
    subQuery: false
  })
  .then( results => {

    results = results.map( item => {
        item = item.toJSON();
        item.creator = item.user.username;

        if (item.loggedInVote) {
          item.loggedInVote = item.loggedInVote.voteValue;
        }

        item = _.pick(item, [ 'id',
                              'creator',
                              'url',
                              'title',
                              'createdAt',
                              'voteScore',
                              'voteDiff',
                              'loggedInVote' ]);
        return item;
    });

    if (request.loggedIn) {
      var user = _.pick(request.loggedIn.toJSON(), ['username']);
    }

    var data = {
      posts: results,
      loggedIn: user && user.username || null
    };

    var homepage = layout.renderPage(
      layout.HomePage(data), 'Reddit Clone');

    response.status(200).send(homepage);
  })
  .catch( err => {
    console.log(err.stack);
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
    var contentId = request.body.contentId;
    var voteValue = parseInt(request.body.vote);

    db.Content.findById(contentId)
    .then( content => {
      db.Vote.findOne({
        where: {userId: user.dataValues.id,
                contentId: contentId}
      })
      .then( vote => {
        if (vote) {
          if (vote.toJSON().voteValue === voteValue) {
            console.log('attempting to destroy vote');
            vote.destroy();
          }
          else {
            console.log('updating vote');
            user.addVotes(content, {voteValue: voteValue});
          }
        }
        else {
          console.log('creating vote');
          user.addVotes(content, {voteValue: voteValue});
        }
      })
    })
    .then( () => response.status(200).send() );
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
app.listen(8080);
