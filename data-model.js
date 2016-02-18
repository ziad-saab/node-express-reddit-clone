var sequelize = require("sequelize");
var bcrypt = require("bcrypt");
var db = require("./db.js");


var database = new sequelize("reddit_clone", "codertaker", "", {
    dialect: "mysql"
});

var user = db.user;

var content = database.define("Content", {
    url: {
        type: sequelize.STRING,
        validate: {
            len: [1, 500]
        }
    },
    title: {
        type: sequelize.STRING,
        validate: {
            len: [5,30]
        }
    },
});

var vote = database.define("Vote", {
    upDown: sequelize.BOOLEAN
});

content.belongsTo(user);
user.hasMany(content); 

user.belongsToMany(content, {through: vote, as: 'Upvotes'});
content.belongsToMany(user, {through: vote});

database.sync(); 
