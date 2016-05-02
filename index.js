require('babel-register');
var Sequelize = require('sequelize');
var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt');
var secureRandom = require('secure-random');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

function createSessionToken() {
    return secureRandom.randomArray(40).map(code => code.toString(16)).join('')
}

function checkLoginToken(request, response, next) {
  if (request.cookies.sessionCookie) {
    Session.findOne({
      where: {
        token: request.cookies.sessionCookie
      },
      include: User // so we can add it to the request
    }).then(
      function(session) {
        // session will be null if no token was found
        if (session) {
          request.loggedInUser = session.user;
        }

        // No matter what, we call `next()` to move on to the next handler
        next();
      }
    )
  } else {
      next();
  }
}

// Adding the middleware to our express stack. This should be AFTER the cookieParser middleware
app.use(checkLoginToken);


var db = new Sequelize('reddit_clone', 'nicjo', '', {
  dialect: 'mysql'
  });


var User = db.define('user', {
    email: Sequelize.STRING,
    username: {type: Sequelize.STRING, unique: true},
    hashed_password: Sequelize.STRING,
    password: {  // TODO: make the passwords more secure!
        type: Sequelize.VIRTUAL,
        set: function(actualPassword) {
            this.setDataValue('hashed_password', bcrypt.hashSync(actualPassword, 10));
        }
    }
});

// Even though the content belongs to users, we will setup the userId relationship later
var Content = db.define('content', {
    url: Sequelize.STRING,
    title: Sequelize.STRING
});

// Even though a vote has a link to user and content, we will setup the relationship later
var Vote = db.define('vote', {
    upVote: Sequelize.BOOLEAN
});

var Session = db.define('session', {
    token: Sequelize.STRING
});

User.hasMany(Session); // This will let us do user.createSession
Session.belongsTo(User); // This will let us do Session.findOne({include: User})


// User <-> Content relationship
Content.belongsTo(User); // This will add a `setUser` function on content objects
User.hasMany(Content); // This will add an `addContent` function on user objects

// User <-> Vote <-> Content relationship
User.belongsToMany(Content, {through: Vote, as: 'Upvotes'}); // This will add an `add`
Content.belongsToMany(User, {through: Vote});

Content.hasMany(Vote); //needed to add the contentId in Vote
User.hasMany(Vote);


var renderPage = require("./rendering");


function newestList(callback) {
    Content.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        limit: 25,
        include: [User]
    }).then(function(result) {
        callback(result);
    });
}


// Sequelize query that can get you Contents along with its "vote score", ordered by vote score:

// The sorting can be made more efficient by passing parameters for the 'order by' (Codrin's example).
// Sorting can be a single function and then the app.get can also be a single function with 'if' statements for each type of sorting.


function topList(callback) {
    Content.findAll({
        include: [
            {
                model: Vote,
                attributes: [],
            },
            {
                model: User
            }
        ],
        group: 'content.id',
        attributes: {
            include: [
                [Sequelize.fn('SUM', Sequelize.fn('IF', Sequelize.col('votes.upVote'), 1, -1)), 'voteScore']
            ]
        },
        order: [Sequelize.literal('voteScore DESC')],
        limit: 25,
        subQuery: false
    }).then(function(result) {
     
        callback(result);
    });
}

// function homepageHtml(listResults) {
//         var html = `<div>
//                       <a href="/">Home</a>
//                       <a href="/login">Login</a>
//                       <a href="/signup">Signup</a>
//                       <a href="/createContent">Create a post</a>
//                     </div>
//                     <div id="contents"><h1>List of contents</h1>
//                     <div>
//                       <a href="/">Top</a>
//                       <a href="/newest">Newest</a>
//                     </div>
//                     <ul class="contents-list">`
//     listResults.forEach(function(item) {
//         html += `<li class="content-item"><h2 class="content-item__title"><a href="${item.url}">${item.title}</a></h2><p>Created by ${item.user.username}</p></li>
//                             

//                              <form action="/voteContent" method="post">
//                                 <input type="hidden" name="upVote" value="true">
//                                 <input type="hidden" name="contentId" value="${item.id}">
//                                     <button type="submit">upvote this</button>
//                             </form>
//                             <div><a>${item.voteScore ? item.voteScore : 0}</a></div>
//                             <form action="/voteContent" method="post">
//                                   <input type="hidden" name="upVote" value="false">
//                                   <input type="hidden" name="contentId" value="${item.id}">
//                                     <button type="submit">downvote this</button>
//                             </form>
//                             `
//     });
//     html += '</ul></div>';
//     return html;
// }


// app.get('/', function(req, res){
//     topList(function(result){
//         var html = homepageHtml(result);
//         res.send(html);
//     });
// });



app.get('/', function(req, res){
    topList(function(result){
        var html = renderPage.renderHome(result);
        res.send(html);
    });
});

app.get('/newest', function(req, res){
    newestList(function(result){
        var html = homepageHtml(result);
        res.send(html);
    });
});


// app.get('/signup', function(request, response) {
//   // code to display signup form
//   var options = {
//     root: __dirname
// }
// var fileName = 'signup-form.html'

// response.sendFile(fileName, options, function (err){
//   if (err) {
//       console.log(err);
//       response.status(err.status).end();
//     }
//     else {
//       console.log('Sent:', fileName);
//     }
// })
// });

app.get('/signup', function(request, response) {
    var html = renderPage.renderSignup({error: request.query.error});
    response.send(html);
    
});


app.post('/signup', function(request, response) {
    // code to signup a user
    // hint: you'll have to use bcrypt to hash the user's password
    var email = request.body.email;
    var username = request.body.username;
    var password = request.body.password;
    
    // if (username === '') {
    //     response.send('Please enter a username.')
    // }
    if (username.length < 4) {
        response.redirect('/signup?error=Username must contain at least 3 characters');
    }
    else {

        User.findOne({
            where: {
                username: username,
            }
        }).then(function(user) {
            if (!user) {
                // here we would use response.send instead :)
                User.create({
                    email: email,
                    username: username,
                    password: password
                });
                response.redirect(303, '/login');
            }
            else {
                response.redirect('/signup?error=The username ${username} already exists');
            };

        });
    }
});


// References an external html file
// app.get('/login', function(request, response) {
//     // code to display login form
//     var options = {
//         root: __dirname
//     }
//     var fileName = 'login-form.html'

//     response.sendFile(fileName, options, function(err) {
//         if (err) {
//             console.log(err);
//             response.status(err.status).end();
//         }
//         else {
//             console.log('Sent:', fileName);
//         }
//     })
// });


// // Html is built in the get parameter
// app.get('/login', function(request, response) {
    
//   var maybeError = request.query.error;

//   var html = `<form action='/login' method='post'>`;
//   if (maybeError) {
//     html += `<div>${maybeError}</div>`;
//   }
//   else {
//   html += `<div>
//                 <input type='text' name='username'></div>
//             <div>
//                 <input type="password" name="password" placeholder="Enter your password">
//             </div>
//                 <button type="submit">Sign Up!</button>`;
//     html += `</form>`;
//   //...
//   // and then finally
//   }
//   response.send(html);
// })





app.get('/login', function(request, response) {
    var html = renderPage.renderLogin({error: request.query.error});
    response.send(html);
});




app.post('/login', function(request, response) {
    // code to login a user
    // hint: you'll have to use response.cookie here
    var username = request.body.username;
    var password = request.body.password;

    User.findOne({
        where: {
            username: username
        }
    }).then(
        function(user) {
            if (!user) {
                // here we would use response.send instead :)
                response.redirect('/login?error=Username or Password incorrect');
                    //   console.log('username or password incorrect');
            }
            else {
                // Here we found a user, compare their password!
                var isPasswordOk = bcrypt.compareSync(password, user.hashed_password);

                if (isPasswordOk) {
                    
                    // this is good, we can now "log in" the user
                    var token = createSessionToken();

                    user.createSession({
                        token: token
                    }).then(function(session) {
                        // Here we can set a cookie for the user!
                        response.cookie('sessionCookie', token);
                        response.redirect('/');
                    });
                    
                }
                else {
                    response.redirect('/login?error=Username or Password incorrect');
                }
            }
        }
    );

});



app.get('/createContent', function(request, response) {
  var html = renderPage.renderContent({error: request.query.error});
    response.send(html);
});


// app.post('/createContent', function(request, response) {

//     if (!request.loggedInUser) {
//         // HTTP status code 401 means Unauthorized
//         response.status(401).send('You must be logged in to create content!<br>Login <a href="/login">HERE</a>');
//     } else if (request.body.title.length < 4 || request.body.url.length < 4) {
//         response.send('Username must contain at least 3 characters.<br> <a href="/signup"><strong>Click Here</strong></a> to try again.');
//     }
//     else {
        
//     // response.send('derp')
//         request.loggedInUser.createContent({
//             title: request.body.title,
//             url: request.body.url

//         }).then(
//             function(content) {
//                 response.redirect('/');
//             });
//     }
// });

app.post('/createContent', function(request, response) {

    if (!request.loggedInUser) {
        // HTTP status code 401 means Unauthorized
        response.redirect('/createContent?error=You must be logged in to create content!');
    } else if (request.body.title.length < 5 || request.body.url.length < 5) {
        response.redirect('/createContent?error=Title and url must contain at least 5 characters');
    }
    else {
        
    // response.send('derp')
        request.loggedInUser.createContent({
            title: request.body.title,
            url: request.body.url

        }).then(
            function(content) {
                response.redirect('/');
            });
    }
});



app.post('/voteContent', function(request, response) {
   console.log(request.loggedInUser)
    if (!request.loggedInUser) {
       
        // HTTP status code 401 means Unauthorized
        response.status(401).send('You must be logged in to vote on content!<br>Login <a href="/login">HERE</a>');
    }
    else {

        Vote.findOne({
            where: {
            userId: request.loggedInUser.id,
            contentId: request.body.contentId
            }
            
        }).then(
            function(vote) {
                if (!vote) {
                    // here we didn't find a vote so let's add one. Notice Vote with capital V, the model
                    return Vote.create({
                        userId: request.loggedInUser.id,
                        contentId: request.body.contentId,
                        upVote: request.body.upVote
                    });
                }
                else {
                    // user already voted, perhaps we need to change the direction of the vote?
                    console.log(vote.get('upVote'));
                    console.log(request.body.upVote);
                    return vote.update({
                        upVote: request.body.upVote
                        // upVote: !vote.get("upVote") //This should be what we received from the user
                    });
                }
            }
        ).then(
            // Look at the two returns in the previous callbacks. In both cases we are returning
            // a promise, one to create a vote and one to update a vote. Either way we get the result here
            function(vote) {
                // Good to go, the user was able to vote. Let's redirect them to the homepage?
                response.redirect('back');

                // Perhaps we could redirect them to where they came from?
                // Try to figure out how to do this using the Referer HTTP header :)
            }
        );
    }
});





// Here's one that will let you cast a vote for a user:
// // First check if a vote already exists
// Vote.findOne({
//     muserId: 1, // This should be the currently logged in user's ID
//     contentId: 1 // This should be the ID of the content we want to vote on
// }).then(
//     function(vote) {
//         if (!vote) {
//             // here we didn't find a vote so let's add one. Notice Vote with capital V, the model
//             return Vote.create({
//                 muserId: 1,
//                 contentId: 1
//             });
//         }
//         else {
//             // user already voted, perhaps we need to change the direction of the vote?
//             return vote.update({
//                 upVote: true //This should be what we received from the user
//             });
//         }
//     }
// ).then(
//     // Look at the two returns in the previous callbacks. In both cases we are returning
//     // a promise, one to create a vote and one to update a vote. Either way we get the result here
//     function(vote) {
//         // Good to go, the user was able to vote. Let's redirect them to the homepage?
//         response.redirect('/');

//         // Perhaps we could redirect them to where they came from?
//         // Try to figure out how to do this using the Referer HTTP header :)
//     }
// );







/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
        var server = app.listen(process.env.PORT, process.env.IP, function() {
        var host = server.address().address;
        var port = server.address().port;

        console.log('Example app listening at http://%s:%s', host, port);
    });