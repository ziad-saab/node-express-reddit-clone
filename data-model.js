var Sequelize = require("sequelize");

var db = new Sequelize('reddit_clone', 'philraj', null, {
  dialect: 'mysql'
});

var User = db.define('user', {
  username: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING // TODO: make the passwords more secure!
});

var Content = db.define('content', {
  url: Sequelize.STRING,
  title: Sequelize.STRING
});

var Vote = db.define('vote', {
  upVote: Sequelize.BOOLEAN
});

Content.belongsTo(User); // This will add a `setUser` function on content objects
User.hasMany(Content); // This will add an `addContent` function on user objects

User.belongsToMany(Content, {through: Vote, as: 'upVotes'}); // This will add an `add`
Content.belongsToMany(User, {through: Vote});

//sequelize helper functions
function createNewUser (name, pass, email) {
  return User.create({
    username: name,
    password: pass,
    email: email
  })
}

function createNewContent (userID, url, title) {
  return User.findById(userID)
  .then( function(user) {
    return user.createContent({
      url: url,
      title: title
    })
  })
}

function voteOnContent (contentID, userID, isUpVote) {
  return Promise.all([
    User.findById(userID),
    Content.findById(contentID)
  ])
  .then( function (val) {
    val[0].addUpVotes(val[1], {
      upVote: isUpVote
    })
  })
}

db.sync();

module.exports = {
  createNewUser: createNewUser, 
  createNewContent: createNewContent,
  voteOnContent: voteOnContent,
  Content: Content,
  User: User,
  Vote: Vote,
  Sequelize: Sequelize
}