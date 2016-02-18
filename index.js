var Sequelize = require('sequelize');
var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var db = new Sequelize('reddit_clone', 'nicjo', '', {
  dialect: 'mysql'
  });


var User = db.define('user', {
    email: Sequelize.STRING,
    username: Sequelize.STRING,
    password: Sequelize.STRING // TODO: make the passwords more secure!
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

// User <-> Content relationship
Content.belongsTo(User); // This will add a `setUser` function on content objects
User.hasMany(Content); // This will add an `addContent` function on user objects

// User <-> Vote <-> Content relationship
User.belongsToMany(Content, {through: Vote, as: 'Upvotes'}); // This will add an `add`
Content.belongsToMany(User, {through: Vote});


function homepageList(callback) {
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

function homepageHtml(homepageListResults) {
    var html = '<div id="contents"><h1>List of contents</h1><ul class="contents-list">'
    homepageListResults.forEach(function(item) {
        html += '<li class="content-item"><h2 class="content-item__title"><a href="' + item.url + '">' + item.title + '</a></h2><p>Created by ' + item.user.username + '</p></li>'
    });
    html += '</ul></div>';
    return html;
}


app.get('/', function(req, res){
    homepageList(function(result){
        var html = homepageHtml(result);
        res.send(html);
    });
});


app.get('/signup', function(request, response) {
  // code to display signup form
  var options = {
    root: __dirname
}
var fileName = 'signup-form.html'

response.sendFile(fileName, options, function (err){
  if (err) {
      console.log(err);
      response.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
})
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/signup', function(request, response) {
  // code to signup a user
  // ihnt: you'll have to use bcrypt to hash the user's password
  
  
});



/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
        var server = app.listen(process.env.PORT, process.env.IP, function() {
        var host = server.address().address;
        var port = server.address().port;

        console.log('Example app listening at http://%s:%s', host, port);
    });
