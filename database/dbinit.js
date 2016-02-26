/*
Initialise the database
*/

var db = require('mysql-promise')();
var Sequelize = require('sequelize');
var bcrypt = require('bcrypt-nodejs');
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
var CommentVote;

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
				var salt = bcrypt.genSaltSync(10);
				// Hash the password with the salt
				var hash = bcrypt.hashSync(actualPassword, salt);
				this.setDataValue('hashed_password', hash);
			}
		},
		email: Sequelize.STRING(50)
	});
	//define session table
	Session = db.define('session', {
		token: Sequelize.STRING
	});
	User.hasMany(Session);
	Session.belongsTo(User);

	//define content table
	Content = db.define('content', {
		url: Sequelize.STRING,
		title: Sequelize.STRING
	});
	Content.belongsTo(User);
	User.hasMany(Content);


	//define vote table
	Vote = db.define('vote', {
		upVote: Sequelize.BOOLEAN
	});

	User.belongsToMany(Content, {through: Vote, as: 'Upvotes'});
	Content.belongsToMany(User, {through: Vote, as: 'Upvotes'});
	Content.hasMany(Vote, {as: 'uservotes'});
	Content.hasMany(Vote);

	//define comment table
	Comment = db.define('comment', {
		text: Sequelize.TEXT
	});

	Comment.hasMany(Comment, {as: 'children', foreignKey: 'parentId'});
	Comment.belongsTo(User);
	User.hasMany(Comment);
	Content.hasMany(Comment);

	//define comment vote table
	CommentVote = db.define('commentvote', {
		upVote: Sequelize.BOOLEAN
	});

	User.belongsToMany(Comment, {through: CommentVote, as: 'Commentvotes'});
	Comment.belongsToMany(User, {through: CommentVote, as: 'Commentvotes'});
	Comment.hasMany(CommentVote, {as: 'usercommentvotes'});
	Comment.hasMany(CommentVote, {as: 'childvotes'});
	Comment.hasMany(CommentVote);

	return db.sync();
})
module.exports = dbInit.then(function() {
	return {
		User: User,
		Session: Session,
		Content: Content,
		Vote: Vote,
		Comment: Comment,
		CommentVote: CommentVote,
		db: db,
		Sequelize: Sequelize
	}
});
