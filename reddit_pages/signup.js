//require('longjohn');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Sequelize = require('sequelize')
var bcrypt = require('bcrypt');

var db = new Sequelize('reddit_clone', 'aliyahmaliyah', '', {
    dialect: 'mysql'
});

//tables 
var User = db.define('user', {
    username: Sequelize.STRING,
    passwordHash: Sequelize.STRING,
    password: {
        type: Sequelize.VIRTUAL,
        set: function(actualPassword) {
            this.setDataValue('passwordHash', bcrypt.hashSync(actualPassword, 10));
        }
    }
});

var Content = db.define('content', {
    url: Sequelize.STRING,
    title: Sequelize.STRING
});

var Vote = db.define('vote', {
    upVote: Sequelize.BOOLEAN
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

//signup form
app.get('/signup/', function(request, response) {
    var options = {
        root: __dirname,
    }
    response.sendFile('form-signup.html', options);

});

app.use(bodyParser.urlencoded({extended: false})); // when we recieve a form comes in URL encoded 


app.post('/signup/', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    
   
    
    User.findOne({
        where: {
            username: username
        }
    }).then(
        function(user) {
            if (!user) {
                User.create({
                    username: username,
                    password: password
                }).then(function(user) {
                     response.send("yay!");
                    console.log(user.toJSON());
                });
            }
            else {
                response.send('Pick another username!');
            }
        }
    );
});


app.listen(process.env.PORT);