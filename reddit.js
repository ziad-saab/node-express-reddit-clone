var Models = require('./models/index.js');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var secureRandom = require('secure-random');
var Sequelize = require('sequelize');
var mysql = require('mysql');
var bcrypt = require('bcrypt');


//Middlware
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkLoginToken);


//Homepage

function buildHTMLlist(array) {
    var html = `<div id="contents">
      <h1>List of contents</h1>
      <ul class="contents-list">`
    array.forEach(function(item) {
        html += `<li class="content-item">
         <h2 class="content-item__title">
         <a href=` + item.url + `>` + item.title + `</a>
          </h2>
          <p>` + item.user.username + `</p>
        </li>`
    })
    html += `</ul> 
        </div>`
    return html;
}

app.get('/', function(request, response) {
    Models.contents.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        limit: 25,
        include: Models.users

    }).then(function(results) {
        var html = buildHTMLlist(results);
        response.send(html);
    });
});


//Login

function createSessionToken() {
    return secureRandom.randomArray(40).map(code => code.toString(16)).join('')
}

//function to check cookies
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
    } else {
        next();
    }
    
}
//Login form
app.get('/login/', function(request, response) {
    var options = {
        root: __dirname,
    }
    response.sendFile('reddit_pages/form-login.html', options);

});


//Receipt of login
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
                        response.redirect('/')
                    })
                }
                else {
                    console.log('Username or password incorrect');
                }
            }
        }
    )
});

//Sign up

app.get('/signup/', function(request, response) {
    var options = {
        root: __dirname,
    }
    response.sendFile('reddit_pages/form-signup.html', options);

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
                    response.redirect('/login/');
                    console.log(user.toJSON());
                });
            }
            else {
                response.send('Pick another username!');
            }
        }
    );
});

//Create Content

app.get('/createContent', function(request, response) {
    var options = {
        root: __dirname,
    }
    response.sendFile('reddit_pages/form-content.html', options);

});

app.post('/createContent', function(request, response) {
    if (!request.loggedInUser) {
            response.status(401).send('You must be logged in to create content!');
    } else {
            
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

app.listen(process.env.PORT);