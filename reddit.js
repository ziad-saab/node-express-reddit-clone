//require('longjohn')
require('babel-register');
var render = require("./rendering.jsx");
var Models = require('./models/index.js');
//Express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
//Other dependencies 
var secureRandom = require('secure-random');
var Sequelize = require('sequelize');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var _request=require('request')
var cheerio=require('cheerio')


function checkLoginToken(request, response, next) {
     console.log(request.cookies.SESSION)

    if (request.cookies.SESSION) {
        Models.sessions.findOne({
            where: {
                token: request.cookies.SESSION
            },
            include: Models.users
        }).then(
            function(session) {
                if (session) {
                    request.loggedInUser = session.user;
                    //CHECK INTO SESSION.USER IS AN INSTANCE OF USER (OBJ THAT INCL METHODS USER OBJ. SHOULDN'T BE A STRING)
                }
                next();
            }
        );
    }
    else {
        next();
    }

}

//Middlware
app.use(express.static('css'))
app.use(express.static('js'))
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(checkLoginToken);



//Homepage

app.get('/', function(request, response) {
    Models.contents.findAll({
        include: [{
            model: Models.votes,
        }, {
            model: Models.users
        }],
        group: 'contents.id',
        attributes: {
            include: [
                [Sequelize.fn('SUM', Sequelize.col('votes.upVote')), 'voteScore']
            ]
        },
        order: [Sequelize.literal('voteScore DESC')],
        limit: 25,
        subQuery: false
    }).then(function(results) {

        response.send(render.renderHomepage(results))
    });
});

app.post('/voteContent', function(request, response) {
    if (request.loggedInUser) { //displays full object rather, not on the body
        Models.votes.findOne({
            where: {
                userId: request.loggedInUser.id,
                contentId: request.body.contentId
            }
        }).then(
            function(vote) {
                if (!vote) {
                    return Models.votes.create({
                        userId: request.loggedInUser.id,
                        contentId: request.body.contentId, // Received from the user's form submit
                        upVote: (request.body.upVote === 'true' ? 1 : -1) // Received from the user's form submit
                    });
                }
                else {
                    return vote.update({
                        upVote: (request.body.upVote === 'true' ? 1 : -1) // Received from the user's form submit
                    });
                }
            }
        ).then(
            function(vote) {
                response.redirect('/');
            }
        )
    }
    else {
        response.redirect('/login')
    }
});


//Login

function createSessionToken() {
    return secureRandom.randomArray(40).map(code => code.toString(16)).join('')
}



//Login form
app.get('/login/', function(request, response) {
    response.send(render.renderLogin({error: request.query.error}));
});

app.post('/login/', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    Models.users.findOne({
        where: {
            username: username
        }
    }).then(
        function(user) {
            if (!user) {
                response.redirect('/signup?error=You must sign up!');
            }
            else {
                var isPasswordOk = bcrypt.compareSync(password, user.passwordHash)
                if (isPasswordOk) {
                    var token = createSessionToken();
                    user.createSession({
                        token: token
                    }).then(function(session) {
                        response.cookie('SESSION', token);
                        response.redirect('/')
                    })
                }
                else {
                    response.redirect('/login?error=Username or password incorrect');
                }
            }
        }
    )
});

//Sign up

app.get('/signup/', function(request, response) {
    response.send(render.renderSignup({error: request.query.error}));
});

app.post('/signup/', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;

    Models.users.findOne({
        where: {
            username: username
        }
    }).then(
        function(user) {
            if (!user) {
                Models.users.create({
                    username: username,
                    password: password
                }).then(function(user) {
                    response.redirect('/login');
                    console.log(user.toJSON());
                });
            }
            else {
                response.redirect('/signup?error=Pick another username!');
            }
        }
    );
});

//Create Content

app.get('/createContent', function(request, response) {
    response.send(render.renderCreateContent({error: request.query.error}));

});

app.get('/titleRequest/:url' , function(request, response){
    var url = request.params.url
    _request(url, function(err, res, body){
        if (err){
            console.log ("Error")
        }
        else{
            var $ = cheerio.load(body)
            var title = $('title').html()
            response.send(title);
        }
        
    })
})

app.post('/createContent', function(request, response) {
    if (!request.loggedInUser) {
        response.status(401).redirect('/login?error=You must be logged in to create content!');
    }
    else {

        request.loggedInUser.createContent({
            title: request.body.title,
            url: request.body.url
        }).then(
            function(content) {
                response.redirect('/');
            }
        )
    }
});

app.listen(process.env.PORT, function() {
    console.log('web server started');
});