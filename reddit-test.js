//require('longjohn')
var Models = require('./models/index.js');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var secureRandom = require('secure-random');
var Sequelize = require('sequelize');
var mysql = require('mysql');
var bcrypt = require('bcrypt');

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
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(checkLoginToken);


//Homepage

//Displays list of content on homepage
function buildHTMLlist(array) {
    var html = `<div id="contents">
      <h1>List of contents</h1>
      <ul class="contents-list">`
    array.forEach(function(item) {
        item = item.toJSON();
        html += `<li class="content-item">
         <h2 class="content-item__title">
         <p>${item.voteScore ? item.voteScore : 0}</p>
         <a href=${item.url}>${item.title}</a>
          </h2>
          <p> ${item.user.username}</p>
        <form action="/voteContent" method="post">
        <input type="hidden" name="upVote" value="true">
        <input type="hidden" name="contentId" value="${item.id}">
        <button type="submit">Upvote this!</button>
        </form>
        <form action="/voteContent" method="post">
        <input type="hidden" name="upVote" value="false">
        <input type="hidden" name="contentId" value="${item.id}">
        <button type="submit">Downvote this!</button>
        </form>
        </li>`
    })
    html += `</ul> 
        </div>`
    return html;
}

function sortMe(cb, sort) {
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
        order: [Sequelize.literal(sort + ' DESC')],
        limit: 25,
        subQuery: false
    }).then(function(results) {
        cb(results);
    });
}

app.get('/sort/:sort', function(request, response) {
    if (request.params.sort === 'new'){
        sortMe(function(results) {
            var html = buildHTMLlist(results);
            response.send(html)
        }, "createdAt")
    }
    else if (request.params.sort === 'top'){
        sortMe(function(results){
            var html = buildHTMLlist(results);
            response.send(html)
        }, "voteScore")
    }
    // else if (request.params.sort === 'hot'){
    //     sortMe(function(results){
    //         var html = buildHTMLlist(results);
    //         response.send(html)
    //     }, '(datediff(now(), createdAt))')
    // }
    else if (request.params.sort === '/'){
        sortMe(function(results){
            var html = buildHTMLlist(results);
            response.send(html)
        }, 'createdAt')
    }
})

app.post('/voteContent', function(request, response) {
    if (request.loggedInUser.id) {
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
        );
    }
    else {
        response.redirect('/login')
    }
});


//Login

function createSessionToken() {
    return secureRandom.randomArray(40).map(code => code.toString(16)).join('')
}

//function to check cookies

//Login form
app.get('/login/', function(request, response) {
    var options = {
        root: __dirname,
    }
    response.sendFile('reddit_pages/form-login.html', options);

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

app.listen(process.env.PORT);