var Sequelize = require("sequelize");
var sequelize = new Sequelize("reddit_clone", "codertaker", "" ,{
    dialect: "mysql"
});

var db = {};

db.user = sequelize.import("./models/user.js");
db.content = sequelize.import("./models/content.js");
db.vote = sequelize.import("./models/vote.js");


db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.content.belongsTo(db.user);
db.user.hasMany(db.content); 

db.user.belongsToMany(db.content, {through: db.vote, as: 'Upvotes'});
db.content.belongsToMany(db.user, {through: db.vote, as: "Upvotes"});

module.exports = db;