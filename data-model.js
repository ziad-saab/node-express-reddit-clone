var Sequelize = require("sequelize");
var bcrypt = require('bcrypt');


var db = new Sequelize('reddit_clone', 'phil', null, {
  dialect: 'mysql'
});

var User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  passhash: Sequelize.STRING,
  password: {
      type: Sequelize.VIRTUAL,
      validate: {
        len: [8,40]
      },
      set: function(actualPassword) {
          this.setDataValue('passhash', bcrypt.hashSync(actualPassword, 10));
          this.setDataValue('password', actualPassword);
      }
  }
});

var Content = db.define('content', {
  url: Sequelize.STRING,
  title: Sequelize.STRING
});

var Vote = db.define('vote', {
  voteValue: Sequelize.INTEGER
});

var Session = db.define('session', {
  token: Sequelize.STRING,
});

Content.belongsTo(User);
User.hasMany(Content);

User.belongsToMany(Content, {through: Vote, as: 'votes'});
Content.belongsToMany(User, {through: Vote, as: 'votes'});
Content.hasMany(Vote);
Content.hasOne(Vote, {as: 'loggedInVote'});
Vote.belongsTo(Content);

User.hasMany(Session);
Session.belongsTo(User);

db.sync({
  // force: true
});

module.exports = {
  Content: Content,
  User: User,
  Vote: Vote,
  Session: Session,
  Sequelize: Sequelize
}
