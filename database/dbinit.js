var db = require('mysql-promise')();
var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');
var username = require('../config.json').username;


db.configure({
	"host": "localhost",
	"user": username,
	"password": "",
	"database": ""
});

var User;
var Session;
var Content;
var Vote;
var Comment;

//create database if it doesn't already exist
var dbInit = db.query('create database reddit_clone')
.catch(function(e) {
	if (e.code === 'ER_DB_CREATE_EXISTS')
	console.log('reddit_clone database already exists');

	else throw e;
})
.then(function(res) {
	//change database to sequelize after creating a database
	db = new Sequelize('reddit_clone', username, '', {
		dialect: 'mysql'
	});
	//define users table
	User = db.define('user', {
	    username: {
				type: Sequelize.STRING(20),
				unique: true,
				allowNull: false
			},
	    hashed_password: Sequelize.STRING,
	    password: {
	        type: Sequelize.VIRTUAL,
	        set: function(actualPassword) {
	            this.setDataValue('hashed_password', bcrypt.hashSync(actualPassword, 10));
	        }
	    },
			email: Sequelize.STRING(50)
	});
	Session = db.define('session', {
	    token: Sequelize.STRING
	});
	User.hasMany(Session);
	Session.belongsTo(User);

	Content = db.define('content', {
	  url: Sequelize.STRING,
	  title: Sequelize.STRING
	});
	Content.belongsTo(User);
	User.hasMany(Content);

  Vote = db.define('vote', {
    upVote: Sequelize.BOOLEAN
  });

  User.belongsToMany(Content, {through: Vote, as: 'Upvotes'});
  Content.belongsToMany(User, {through: Vote, as: 'Upvotes'});
  Content.hasMany(Vote, {as: 'uservotes'});
  Content.hasMany(Vote);

  Comment = db.define('comment', {
    text: Sequelize.STRING
  });

  Comment.hasMany(Comment, {as: 'children', foreignKey: 'parentId'});
  User.hasMany(Comment);
  Content.hasMany(Comment);

	return db.sync();
})
module.exports = dbInit.then(function() {
return {
  User: User,
  Session: Session,
  Content: Content,
  Vote: Vote,
  Comment: Comment,
  db: db,
  Sequelize: Sequelize
}
});
