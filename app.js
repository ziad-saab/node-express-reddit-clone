var secureRandom = require('secure-random')
var Sequelize = require("sequelize");
var express = require('express');
var app = express();
var Content = require('./app.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var sha = require('./node_modules/sha-1/sha1');
var bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());
app.use(checkLoginToken)

//session cookie check
function createSessionToken(){
    return secureRandom.randomArray(40).map(code => code.toString(16)).join('');
}

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
  } else {
      next()
  }
}



var db = new Sequelize ('reddit_clone','dm87', '', {dialect:'mysql'});

var User = db.define('user',{
    username: {
            type: Sequelize.STRING,
            unique: true
             }, 
    hashed_password: Sequelize.STRING,
    password: {
                type: Sequelize.VIRTUAL,
                set: function (actualPassword){
                  this.setDataValue('hashed_password', bcrypt.hashSync(actualPassword, 10))
                }}
});


var Content = db.define('content',{
    url: Sequelize.STRING,
    title: Sequelize.STRING,
});

var UpVote = db.define('upvote',{
    upvote: Sequelize.BOOLEAN
});

var Session = db.define('session', {
    token: Sequelize.STRING
});

User.hasMany(Session);
Session.belongsTo(User);

Content.belongsTo(User);
User.hasMany(Content);

User.belongsToMany(Content, {through: UpVote, as: 'upvote'}); // This will add an `add`
Content.belongsToMany(User, {through: UpVote, as: 'upvote'});
Content.hasMany(UpVote);




//////HOME PAGE/////
app.get('/',function(req,res){
    Content.findAll(
        {
            include: [{model: UpVote, attributes: []}, User],
            group: 'content.id',
            attributes: {
                include: [
                    [Sequelize.fn('SUM', Sequelize.fn('IF', Sequelize.col('upvotes.upvote'), 1, -1)), 'voteScore']
                ]
            },
    order: [Sequelize.literal('voteScore DESC')]
}
        
        ).then(function(val){
        var listItems = val.reduce(function(acc, item){
            acc = acc + `<li><h2><a href=${item.url}>${item.title}</a></h2><p>Created By: ${item.user.username} | on: ${item.createdAt} | popularity: (${item.dataValues.voteScore})</p>
              <form style='display:inline-block;padding:5px' action="/voteContent" method="post">
              <input type="hidden" name="upVote" value="true">
              <input type="hidden" name="contentId" value=${item.id}>
              <button type="submit">upvote this</button>
                            </form><form style='display:inline-block' action="/voteContent" method="post">
              <input type="hidden" name="upVote" value="false">
              <input type="hidden" name="contentId" value=${item.id}>
              <button type="submit">downvote this</button>
            </form>
            </li>`
            return acc
            },"")
        var menu = `<ul style="display:inline-block;margin-right:150px">
          <li><a href="/">Home</a></li>
          <li><a href="/CreateUser">SignUp!</a></li>
          <li><a href="/CreateContent">Post</a></li>
          <li><a href="/SignIn">Login</a></li>
        </ul>`    
        res.send(`<div style="float:right;text-align:center;list-style:none">${menu}</div><div style="font-family:Courier New"><h1 style="font-family:impact">Your random Posts</h1><hr><ul>${listItems}</ul></div>`)
            })
        
});

//////CREATE CONTENT/////
app.get('/createContent', function(req,res){
    res.sendFile(__dirname + '/form.html');
});
app.post('/createContent', function(req, res){
    if(!req.loggedInUser){
    res.status(401).send('You must be logged in to create content!');
    } else {
    req.loggedInUser.createContent({
            title: req.body.title,
            url: req.body.url
        }).then(function(val){
        res.redirect("/");
});}});


////////  CREATE A NEW USER  //////
app.get('/createUser', function(req,res){
    res.sendFile(__dirname + '/createUser.html')
})
app.post('/createUser', function(req, res){
            User.create({
                username: req.body.username,
                password: req.body.password
            });
            res.redirect('/SignIn');
        }
    );



/////////   SIGN IN   ///////////
app.get('/signIn', function(req,res){
    res.sendFile(__dirname + '/signIn.html')
})
app.post('/signIn', function(req, res) {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(function(user) {
        if (!user) {
            res.send('incorrect') //user not found
        }
        else { //check for password
            var isPassWordOk = bcrypt.compareSync(req.body.password, user.hashed_password);

            if (isPassWordOk) {
                var token = createSessionToken();
                user.createSession({
                        token: token
                    })
                    .then(function(session) {
                        res.cookie('SESSION', token);
                        res.redirect('/')
                    });
            }
            else {
                res.send('incorrect')
            }

        }
    })
})

/////VOTING/////




app.post('/voteContent', function(req,res) {
    UpVote.findOne({
        where: {
            userId: req.loggedInUser.id,
            contentId: req.body.contentId
                }}).then(function(val){
                    if (!val){
                        UpVote.create({
                            userId: req.loggedInUser.id,
                            contentId: req.body.contentId,
                            upvote: req.body.upVote
                        })
                    } else {
                         return val.update({
                             upvote: req.body.upVote
                         })
                    }
                }).then(function(val){
                    res.redirect('/')
                })
})




app.listen(process.env.PORT);
