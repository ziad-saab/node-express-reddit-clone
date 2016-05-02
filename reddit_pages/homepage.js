var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Sequelize = require('sequelize')
var mysql = require('mysql')

var db = new Sequelize('reddit_clone', 'aliyahmaliyah', '', {
    dialect: 'mysql'
});
var User = db.define('user', {
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    //password: Sequelize.STRING ,
    passwordHash: Sequelize.STRING
});

var Content = db.define('content', {
    url: Sequelize.STRING,
    title: Sequelize.STRING
});

var Vote = db.define('vote', {
    upVote: Sequelize.BOOLEAN
});

// User <-> Content relationship
Content.belongsTo(User); 
User.hasMany(Content);

// User <-> Vote <-> Content relationship
User.belongsToMany(Content, {
    through: Vote,
    as: 'Upvotes'
});

Content.belongsToMany(User, {
    through: Vote
});

function getFive(cb){
Content.findAll({
    order: [
        ['createdAt', 'DESC']
        ],
        limit: 25,
        include: User
    
}).then(function(results) {
        cb(results)
    });
}

getFive(function(results){
    return results;
})


function buildHTMLlist(array){
    var html = `<div id="contents">
      <h1>List of contents</h1>
      <ul class="contents-list">`
    array.forEach(function(item) {
        html += `<li class="content-item">
         <h2 class="content-item__title">
         <a href=` + item.url +`>` + item.title + `</a>
          </h2>
          <p>` + item.user.username + `</p>
        </li>`
    })
    html+= `</ul> 
        </div>`
    return html;
}

app.get('/', function(request, response) {
    getFive(function(contents) {
        var html = buildHTMLlist(contents);
        response.send(html);
    });
}); 

app.listen(process.env.PORT);