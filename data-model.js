var Sequelize = require("sequelize");
var bcrypt = require('bcrypt');


var db = new Sequelize('reddit_clone', 'philraj', null, {
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
  upVote: Sequelize.BOOLEAN
});

var Session = db.define('session', {
  token: Sequelize.STRING,
});

Content.belongsTo(User); // This will add a `setUser` function on content objects
User.hasMany(Content); // This will add an `addContent` function on user objects

User.belongsToMany(Content, {through: Vote, as: 'upVotes'}); // This will add an `add`
Content.belongsToMany(User, {through: Vote});
Content.hasMany(Vote);
Vote.belongsTo(Content);

User.hasMany(Session); 
Session.belongsTo(User);


db.sync({
  // force: true
});

// createNewUser('test', 'abc123');

//sequelize helper functions
// function createNewUser (name, pass) {
//   return User.create({
//     username: name,
//     password: pass
//   });
// }

// function createNewContent (userID, url, title) {
//   return User.findById(userID)
//   .then( function(user) {
//     return user.createContent({
//       url: url,
//       title: title
//     });
//   });
// }

// function voteOnContent (contentID, userID, isUpVote) {
//   return Promise.all([
//     User.findById(userID),
//     Content.findById(contentID)
//   ])
//   .then( function (val) {
//     var user = val[0];
//     var content = val[1];
    
//     user.addUpVotes(content, {
//       upVote: isUpVote
//     });
//   });
// }

module.exports = {
  Content: Content,
  User: User,
  Vote: Vote,
  Session: Session,
  Sequelize: Sequelize
}

