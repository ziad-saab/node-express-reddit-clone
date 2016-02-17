var db = require('mysql-promise')();
var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');
var secureRandom = require('secure-random');
var username = require('./config.json').username;

function createSessionToken() {
    return secureRandom.randomArray(40).map(code => code.toString(16)).join('')
}

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
	var Session = db.define('session', {
	    token: Sequelize.STRING
	});
	User.hasMany(Session);
	Session.belongsTo(User);
	return db.sync();
	//return;
})

//Inserts a new user into users table
function createNewUser(username, password, email) {
  return dbInit.then(function(res) {
		return User.create({
	    username: username,
			password: password,
			email: email
	  });
	})
}

//returns a token for a sessionid on successful login, otherwise throws an error
function login(username, password) {
	return dbInit.then(function() {
		User.findOne({
			where: {
				username: username
			}
		})
		.then(function(rawUser) {
			if (!rawUser)
			throw new Error('User not found');

			var user = rawUser.dataValues;
			if(!bcrypt.compareSync(password, user.hashed_password))
			throw new Error('Invalid password');

			var token = createSessionToken();
			return rawUser.createSession({
				token: token
			})
			.then(function(session) {
				return session.token;
			});
		});
	});
}
module.exports = {
	createNewUser: createNewUser,
	login: login
}
