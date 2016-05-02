var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Sequelize = require('sequelize')
var bcrypt = require('bcrypt');
var secureRandom = require('secure-random');
var cookieParser = require('cookie-parser')

var db = new Sequelize('reddit_clone', 'aliyahmaliyah', '', {
    dialect: 'mysql'
});

//tables 
var User = db.define('user', {
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    //password: Sequelize.STRING,
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
Content.belongsTo(User);
User.hasMany(Content);

// User <-> Vote <-> Content relationship
User.belongsToMany(Content, {
    through: Vote,
    as: 'Upvotes'
});

Content.belongsToMany(User, {
    through: Vote
});

User.hasMany(Session); // This will let us do user.createSession
Session.belongsTo(User)

//this will create a session token
function createSessionToken() {
    return secureRandom.randomArray(40).map(code => code.toString(16)).join('')
}


//Middleware 
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());



//Login form
app.get('/login/', function(request, response) {
    var options = {
        root: __dirname,
    }
    response.sendFile('form-login.html', options);

});


//Receipt of login
app.post('/login/', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    User.findOne({
        where: {
            username: username
        }
    }).then(
        function(user) {
            if (!user) {
                response.send('You must sign up!');
            }
            else {
                var isPasswordOk = bcrypt.compareSync(password, user.passwordHash)
                if (isPasswordOk) {
                    var token = createSessionToken();
                    user.createSession({
                        token: token
                    }).then(function(session) {
                        response.cookie('SESSION', token);
                        response.send("You're logged in!") 
                    })
                }
                else {
                    console.log('Username or password incorrect :(');
                }
            }
        }
    )
});

app.listen(process.env.PORT);