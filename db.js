var Sequelize = require("sequelize");
var sequelize = new Sequelize("reddit_clone", "codertaker", "" ,{
    dialect: "mysql"
});

var db = {};

// importing other models
db.user = sequelize.import("./models/user.js");
db.content = sequelize.import("./models/content.js");
db.vote = sequelize.import("./models/vote.js");
db.session = sequelize.import("./models/session.js");

// giving access to Sequelize lib and sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// creating associations
db.content.belongsTo(db.user);
db.user.hasMany(db.content);
db.session.belongsTo(db.user);
db.user.hasMany(db.session);


db.user.belongsToMany(db.content, {through: db.vote, as: 'Upvotes'});
db.content.belongsToMany(db.user, {through: db.vote, as: "Upvotes"});
db.content.hasMany(db.vote);
db.vote.belongsTo(db.content);


// don't forget to EXPORT!!!!
module.exports = db;