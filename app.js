var Sequelize = require("sequelize");
var express = require('express');
var app = express();
var Content = require('./app.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var sha = require('./node_modules/sha-1/sha1');

app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());

var db = new Sequelize ('reddit_clone','dm87', '', {dialect:'mysql'});


//User.findOne({where: {username: }})


var User = db.define('user',{
    username: Sequelize.STRING, //need to make that unique 
    password: Sequelize.STRING 
});

var Content = db.define('content',{
    url: Sequelize.STRING,
    title: Sequelize.STRING,
});

var UpVote = db.define('upvote',{
    upvote: Sequelize.BOOLEAN
});

Content.belongsTo(User);
User.hasMany(Content);

User.belongsToMany(Content, {through: UpVote, as: 'upvote'}); // This will add an `add`
Content.belongsToMany(User, {through: UpVote});

var createNewUser = function(user, password, callback){
    var NewUser = User.create({
        username: user,
        password: password
    });
    callback(NewUser);
};

var createNewContent = function (userid, url, title, callback){
    var newContent = {};
    User.findById(userid).then(function(val){
        newContent = val.createContent({
            url: url,
            title: title
        });
    });
    callback(newContent);
};



app.get('/',function(req,res){
    Content.findAll({limit: 5, include:User} ).then(function(val){
        var listItems = val.reduce(function(acc, item){
            acc = acc + `<li><h2><a href=${item.url}>${item.title}</a></h2><p>Created By: ${item.user.username}</p></li>`
            return acc
            },"")
        res.send(`<div><h1>This is the title</h1><ul>${listItems}</ul></div>`)
            })
        
});
app.get('/createContent', function(req,res){
    if(!req.cookies.USER === undefined){
    res.sendFile(__dirname + '/form.html');
    } else {
        res.redirect('/signIn');
    }
});

app.post('/createContent', function(req, res){
    User.findOne({where: {username:req.cookies.USER}}).then(function(cookiedperson){cookiedperson.createContent({
            title: req.body.title,
            url: req.body.url
        }).then(function(val){
        res.redirect("/")
});})
});

app.get('/createUser', function(req,res){
    res.sendFile(__dirname + '/createUser.html')
})

app.post('/createUser', function(req, res){
    //check if the user exists
    User.findOne({where: {username:req.body.username}}).then(function(user){
        if (user === null){
            User.create({
                username: req.body.username,
                password: sha(req.body.password),
            })
            res.cookie('USER', req.body.username);
            res.redirect('/');
        } else {
    //warn if they already exist
            res.send('This user already exists')
        }
    })
    
})

app.get('/signIn', function(req,res){
    res.sendFile(__dirname + '/signIn.html')
})

app.post('/signIn', function(req,res){
    User.findOne({where:{username:req.body.username, password:sha(req.body.password)}}).then(function(user){
        if (user === null){
             console.log(JSON.stringify(user))
        res.send('Invalid Login Credentials')
        } else {
        res.cookie('USER', req.body.username);
        res.redirect('/');
    }})
})


app.listen(process.env.PORT);
