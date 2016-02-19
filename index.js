var express = require('express');
var app = express();
app.set('json spaces', 2);
var Sequelize = require('sequelize');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var secureRandom = require('secure-random');
var cookieParser = require('cookie-parser');
// var util = require("util")

//GOOD MORNING! REWRITE YOUR FIND5 FUNCTION!! YOU CAN DO IT!



app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
function checkLoginToken(request, response, next) {
  if (request.cookies.SESSION) {
    Session.findOne({
      where: {
        token: request.cookies.SESSION
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
  }
}
app.use(checkLoginToken);

var db = new Sequelize('db','heynah', '', {dialect: 'mysql'});
//var connction ->
/*var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'db'
});

connection.query("SELECT Account.id, AddressBook.accountId, Account.email, AddressBook.name FROM Account LEFT JOIN AddressBook on Account.id=AddressBook.accountId", 
function(err, rows){
} */

var User = db.define('user', {
    username: {
        type:Sequelize.STRING, unique: 'compositeIndex'},
    hashed_password: Sequelize.STRING,
    password: {
        type: Sequelize.VIRTUAL,
        set: function(actualPassword) {
            this.setDataValue('hashed_password', bcrypt.hashSync(actualPassword, 10));
        }
    }
});
var Post = db.define('content', {
    url: Sequelize.STRING,
    title: Sequelize.STRING
});
var Vote = db.define('vote', {
    upVote: Sequelize.BOOLEAN
});
var Session = db.define('session', {
    token: Sequelize.STRING
});

User.hasMany(Session); // This will let us do user.createSession
Session.belongsTo(User); // This will let us do Session.findOne({include: User})

Post.belongsTo(User); 
User.hasMany(Post);

User.belongsToMany(Post, {through: Vote, as: "Upvotes"});
Post.belongsToMany(User, {through: Vote});

Post.hasMany(Vote); // New association, new sync (1)

function buildHtml(contentsArray){
   
  var html = 
  `<div id="contents">
    <h3><a href="https://project-reddit-clone-heynah.c9users.io/login">Login</a> /  <a href="https://project-reddit-clone-heynah.c9users.io/joinUs">Sign-Up</a></h3>
    <h2><a href="https://project-reddit-clone-heynah.c9users.io/postSomething">Add a New Post! </a></h2>
    <h1>List of contents</h1>
      <ul class="contents-list">`
  contentsArray.forEach(function(item){
      console.log(item.user.dataValues)
    html +=
      `<li class="content-item">
      <h2 class="content-item__title">
        <a href="`+ item.url +`">`+ item.title + `</a>
      </h2>
      <p>Created by ` + item.user.dataValues.username + `</p>
      </li>`});
      
    html += `</ul></div>`;
return html;
}




function retrieveTop5(callback) {
  Post.findAll({
  order: [['createdAt','DESC']],
  limit: 5,
  include: User
  }).then(function(res) {
    callback(res);
});

}
function createSessionToken() {
    return secureRandom.randomArray(40).map(code => code.toString(16)).join('');
}

//***GET
app.get('/hello', function (req, res) {
  res.send("<h1>Hello, you handsom devil, you!</h1>");
});
//response.status ->
/*app.get('/op/:operation/:number1/:number2', function (request, response) {
  total ? response.json({"Operation": operator, "First number" : number1, "Second number": number2, "Solution" : total}) 
  : response.status(400).json({error: "Wrong, Buddy! Keep trying (enter an operation 'add', 'sub', 'mult', or 'div' and 2 numbers)."});
});*/


app.get('/', function(req, res) {
   
//if logged in, can do everything=>  
retrieveTop5(function(contents){
    var html = buildHtml(contents);
    res.send(html);
  });
//if not logged in, can view but all html buttons/links will redirect to login/signup    
});

app.get('/joinUs', function(req, res) {
    var options = {
      root: __dirname
    };
   
    res.sendFile("forms/signUpForm.html", options) ;    
});

app.get('/login', function(req, res) {
    var options = {
      root: __dirname
    };
   
    res.sendFile("forms/loginForm.html", options) 
});;

app.get('/postSomething', function(req, res, next) {
    var options = {
      root: __dirname
    };
   
    res.sendFile("forms/postForm.html", options); 
    });
//sendFile error message ->    
/*, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }*/


//***POST
app.post('/joinUs', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
//   res.send(req.body);
 User.findOne({
     where : {username: username}
 }).then(function(newUser){
     if(!newUser){
        User.create({username: username, password: password});
        res.redirect('/');
     } else {
        res.send("<h2>*( sad, you are  not the first. Please register with another <a href='https://project-reddit-clone-heynah.c9users.io/joinUs'>username. </a></h2>")
     }
 })
});


app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
//   if (!req.body) return res.sendStatus(400);    
  User.findOne({
      where : {username: username}
  }).then(function(returningUser) {
      if(!returningUser){
          res.send("<h2>Uh oh, bad username/password combo. Please <a href='https://project-reddit-clone-heynah.c9users.io/login'>try again. </a></h2>");
      } else {
//check password with if else
        //   res.send(returningUser + password + returningUser.hashed_password);
          var isPasswordOk = bcrypt.compareSync(password, returningUser.hashed_password);
          if (isPasswordOk) {
            var token = createSessionToken();
            
            // res.send('password match');
            returningUser.createSession({
                token: token
                }).then(function(session) {
// Here we can set a cookie for the user!
                res.cookie('SESSION', token);
                res.redirect('/');
                });
          } else {
              res.send("<h2>Uh oh, bad username/password combo. Please <a href='https://project-reddit-clone-heynah.c9users.io/login'>try again. </a></h2>");
          }
      }
  })

  //res.send('welcome, ' + req.body.username)
})

app.post('/postSomething', function(req, res) {
  var url = req.body.url;
  var title = req.body.title;
  if (!req.loggedInUser) {
      res.status(401).send("<a href='https://project-reddit-clone-heynah.c9users.io/login'>Make yourself known, Stanger. </a></h2>");
  } else {
      req.loggedInUser.createContent({
          title: title,
          url: url
      }).then(
          function(content){
            console.log(content)
            res.redirect('/');
          })
    }
});

/*User.create({
  username: 'john-doe',
  password: generatePasswordHash('i-am-so-great')
}).then(function(user) {
  /* ... */
/*})*/
/*var url
var title
create content {url: req.body.url})*/

/*app.use(bodyParser.json())

app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})*/


/*express route-specific

This example demonstrates adding body parsers specifically to the routes that need them. In general, this is the most recommend way to use body-parser with express.

// create application/json parser


// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  res.send('welcome, ' + req.body.username)
})

// POST /api/users gets JSON bodies
app.post('/api/users', jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  // create user in req.body
})*/

db.sync(/*{force:true}*/);

/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

  // Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
