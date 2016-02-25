var secureRandom = require('secure-random')
var Sequelize = require("sequelize");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt');
var cheerio = require('cheerio');
var request = require('request');


///react ///
require('babel-register');
var layout = require('./rendering.jsx')


app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());
app.use(checkLoginToken)
app.use(express.static('public'));


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



//////CREATE CONTENT/////
app.get('/createContent', function(req,res){
    res.send(layout.renderCreateContent());
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
    res.send(layout.renderCreateUser())
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
    res.send(layout.renderLoginPage())
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

////SUGGEST TITLE /////
app.get('/userReq', function(req, res){
    request(req.query.url, function (error, response, body) {
    var $ = cheerio.load(body);
    var title = $("title").text()
    res.send(title)
})
})


//////HOME PAGE/////
app.get('/',function(req,res){
    res.redirect(301, '/new')
});

app.get('/:order',function(req,res){
    var order = [];
    switch (req.params.order){
        case 'hot':
            order = [Sequelize.literal('voteScore DESC')];
            break;
        case 'new':
            order = [Sequelize.literal('content.createdAt DESC')];
            break;
        default:
            break;
    } 
    Content.findAll(
        {
            include: [{model: UpVote, attributes: []}, User],
            group: 'content.id',
            attributes: {
                include: [
                    [Sequelize.fn('SUM', Sequelize.fn('IF', Sequelize.col('upvotes.upvote'), 1, -1)), 'voteScore']
                ]
            },
            order: order
}
        
        ).then( function(data){
            
          res.send(layout.renderHomePage(data))
        } 
            )
        
});





app.listen(process.env.PORT);
