var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var db = require("./db.js");
var cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// get page of signup
app.get("/signup", function(req, res) {
    var options = {
        root: __dirname
    };
    res.sendFile("./signup.html", options);
});

// get page of login
app.get("/login", function(req, res) {
    var options = {
        root: __dirname
    };
    res.sendFile("./login.html", options);
});

// get page of homepage
app.get("/homepage", function(req, res) {
    console.log(req.cookies);
    res.clearCookie("loginToken");
    res.send("this is the homepage!!");
});

// get page of createPost
app.get("/createPost", function(req, res) {
    var options = {
        root: __dirname
    };
    res.sendFile("./createPost.html", options);
});

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
            res.cookie("loginToken", "we got token bitches" );
            res.redirect("/homepage");
        }
    }, function (err) {
        res.send(err);
    });
});

// allowing user to create posts.
app.post("/createPost", function(req, res) {
    var title = (req.body.title);
    var url = (req.body.url);
    db.user.create({
        title: title,
        url: url
    }).then(function() {
        res.redirect("/homepage");
    });
});

db.sequelize.sync().then(function() {
    // Boilerplate code to start up the web server
    var server = app.listen(process.env.PORT, process.env.IP, function() {
        var host = server.address().address;
        var port = server.address().port;
        console.log("Your application is listening at http://%s:%s", host, port);
    });
})