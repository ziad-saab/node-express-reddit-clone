var db = require('mysql-promise')();
var Sequelize = require('sequelize');
var sha1 = require('sha1');
var username = require('./config.json').username;

db.configure({
	"host": "localhost",
	"user": username,
	"password": "",
	"database": ""
});

var User;

//create database if it doesn't already exist
var dbInit = db.query('create database reddit_clone')
.catch(function(e) {
	if (e.code === 'ER_DB_CREATE_EXISTS')
	console.log('reddit_clone database already exists');

	else throw e;
})
.then(function(res) {
	//change databae to sequelize after creating a database
	db = new Sequelize('reddit_clone', username, '', {
		dialect: 'mysql'
	});
	//define users table
	User = db.define('user', {
	    username: {type: Sequelize.STRING(20), unique: true, allowNull: false},
	    password: {type: Sequelize.STRING(20), allowNull: false}, // TODO: make the passwords more secure!
			email: Sequelize.STRING(50)
	});
	return db.sync();
	//return;
})

//Inserts a new user into users table
function createNewUser(username, password, email) {
  return dbInit.then(function(res) {
		return User.create({
	    username: username,
	    password: sha1(password),
			email: email
	  });
	})
}

module.exports = {
	createNewUser: createNewUser
}
