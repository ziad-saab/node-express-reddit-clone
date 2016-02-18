var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var Sequelize = require('sequelize')
var express = require('express')
var app = express();

var db = new Sequelize('reddit_clone', 'aliyahmaliyah', '', {
    dialect: 'mysql'
});

var User = db.define('user', {
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    //password: Sequelize.STRING ,
    passwordHash: Sequelize.STRING
});

var Content = db.define('content', {
    url: Sequelize.STRING,
    title: Sequelize.STRING
});

var Vote = db.define('vote', {
    upVote: Sequelize.BOOLEAN
});

var Session = db.define('session', {
    token: Sequelize.STRING
});

// User <-> Content relationship
Content.belongsTo(User); // This will add a `setUser` function on content objects
User.hasMany(Content); // This will add an `addContent` function on user objects

// User <-> Vote <-> Content relationship
User.belongsToMany(Content, {
    through: Vote,
    as: 'Upvotes'
}); // This will add an `add`
Content.belongsToMany(User, {
    through: Vote
});

User.hasMany(Session); // This will let us do user.createSession
Session.belongsTo(User); // This will let us do Session.findOne({include: User})


//function to check cookies
function checkLoginToken(request, response, next) {
    console.log(request.cookies.SESSION)
    
    if (request.cookies.SESSION) {
        Session.findOne({
            where: {
                token: request.cookies.SESSION
            },
            include: User
        }).then(
            function(session) {
                if (session) {
                    request.loggedInUser = session.user;
                    //CHECK INTO SESSION.USER IS AN INSTANCE OF USER (OBJ THAT INCL METHODS USER OBJ. SHOULDN'T BE A STRING)
                }
            }
        );
    }
    next();
}


//Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkLoginToken);


//form to submit content
app.get('/createContent/', function(request, response) {
    var options = {
        root: __dirname,
    }
    response.sendFile('form-content.html', options);

});

app.post('/createContent', function(request, response) {
  if (!request.loggedInUser) {
    response.status(401).send('You must be logged in to create content!');
  }
  else {
    request.loggedInUser.addContent({
      title: request.body.title,
      url: request.body.url
    }).then(
      function(content) {
        response.send('thanks for the content!');
      }
    )
  }
});

app.listen(process.env.PORT);