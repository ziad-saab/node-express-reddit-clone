require('babel-register');
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var db = require("./db.js");
var cookieParser = require("cookie-parser");
var mw = require("./midWare.js")(db);
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
var rl = require("./rendering.jsx");
app.use(express.static('css'));


//////////////////////////////////////////////////////////////////////////////////////

/////////////////////////// APP GET SECTION (BELOW) //////////////////////////////////

// get page of signup
app.get("/signup", function(req, res) {
    res.send(rl.renderSignup({data: ""}));
});

// get page of login
app.get("/login", function(req, res) {
    res.send(rl.renderLogin({title: "Login"}));
});

// get page of homepage
app.get("/homepage", function(req, res) {
    db.content.findAll({
        include:[ {model: db.user}, {model: db.vote}],
        group: 'Content.id',
        attributes: {
            include: [
            [db.sequelize.fn('SUM', db.sequelize.col('Votes.upDown')), 'voteScore']
            ]
        },
        order: [db.Sequelize.literal('voteScore DESC')],
        limit: 25,
        subQuery: false
    }).then(function (allPosts) {
        
        res.send(rl.homePage(allPosts));
    });
});

// get page of createPost
app.get("/createPost", function(req, res) {
    res.send(rl.renderCreatePost({data: ""}));
});

/////////////////////////// APP GET SECTION (ABOVE) ///////////////////////////////////

/////////////////////////// APP POST SECTION (BELOW) //////////////////////////////////

// allowing user to create username and password.
app.post("/signup", function(req, res) {
    var username = (req.body.username);
    var password = (req.body.password);
    var confirmPassword = (req.body.confirmPassword);
    if (password === confirmPassword) {
        db.user.create({
            userName: username,
            password: password
        }).then(function() {
                res.redirect("/login");
        });
    } else {
        res.redirect("/signup");
    }
});

// allowing user to login with username and password.
app.post("/login", function(req, res) {
    db.user.authentication(req.body).then(function(user) {
        if(user) {
            var token = user.genToken();
            user.createSession({token: token}).then(function() {
                res.cookie("loginToken", token);
                res.redirect("/createPost");       
            });
        }
    }, function (err) {
        var data = {
            error: err
        };
        res.send(rl(data));
    });
});

// allowing user to create posts.
app.post("/createPost", mw.checkLoginToken, function(req, res) {
    var title = (req.body.title);
    var url = (req.body.url);
    if (!req.loggedInUser) {
        // HTTP status code 401 means Unauthorized
        res.status(401).send('<h1>You must be logged in to create content!</h1>');
    }
    else {
        req.loggedInUser.createContent({
            title: title,
            url: url
        }).then(function() {
            res.redirect("/homepage");
        });
    }
});

// allowing users to vote
app.post("/voteContent", mw.checkLoginToken, function(req, res) {
    
    
    var voteValue = req.body.upDown === 'true' ? 1 : -1;
    
    db.vote.findOne({
        where: {
            UserId: req.loggedInUser.id, // This should be the currently logged in user's ID
            ContentId: req.body.contentId // This should be the ID of the content we want to vote on
        }
    }).then(function(vote) {
                if (!vote) {
                    // here we didn't find a vote so let's add one. Notice Vote with capital V, the model
                    return db.vote.create({
                        UserId: req.loggedInUser.id, // Received from the loggedIn middleware
                        ContentId: req.body.contentId, // Received from the user's form submit
                        upDown: voteValue // Received from the user's form submit
                    });
                }
                else {
                    // user already voted, perhaps we need to change the direction of the vote?
                    return vote.update({
                        upDown: voteValue === vote.upDown ? 0 : voteValue // Received from the user's form submit
                    });
                }
           }
    ).then(function(){
       db.content.findOne({
        where: {
            id: req.body.contentId
        },
        include:[ {model: db.user}, {model: db.vote}],
        group: 'Content.id',
        attributes: {
            include: [
                 [db.sequelize.fn('SUM', db.sequelize.fn('COALESCE', db.sequelize.col('Votes.upDown'), 1)), 'voteScore'],
                 [db.sequelize.fn('COUNT', db.sequelize.col('Content.id')), 'voteCount']
            ]
        },
        subQuery: false
    }).then(function (post) {
        res.json(post.toJSON());
    });  
    });
});

/////////////////////////// APP POST SECTION (ABOVE) //////////////////////////////////


db.sequelize.sync().then(function() {
    // Boilerplate code to start up the web server
    var server = app.listen(process.env.PORT, process.env.IP, function() {
        var host = server.address().address;
        var port = server.address().port;
        console.log("Your application is listening at http://%s:%s", host, port);
    });
});

