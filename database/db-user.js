/*
Provides functionality for user creation, login, and session verification
*/
var bcrypt = require('bcrypt');
var dbinit = require('./dbinit.js');
var database = require('./database.js');
var secureRandom = require('secure-random');

//constants
const SESSION_LENGTH = 24;
const USR_NOT_FOUND = 'User not found';
const INVALID_PASSWORD = 'Invalid password';
const INVALID_SESSIONID = 'Invalid sessionID';

//creates a random string to use as a sessionID
function createSessionToken() {
    return secureRandom.randomArray(40).map(code => code.toString(16)).join('')
}

//generates the date after which sessions must be created. Any session created
//before will be expired
function expireDate() {
  var date = new Date(Date.now());
  date.setUTCHours(date.getUTCHours() - SESSION_LENGTH);
  return date;
}

//Inserts a new user into users table
function createNewUser(username, password, email) {
  return dbinit.then(function(initDB) {
		return initDB.User.create({
	    username: username,
			password: password,
			email: email
	  });
	})
}
//returns a token for a sessionid on successful login, otherwise throws an error
function login(username, password) {
	return dbinit.then(function(initDB) {
		return initDB.User.findOne({
			where: {
				username: username
			}
		})
		.then(function(rawUser) {
			if (!rawUser)
			throw new Error(USR_NOT_FOUND);

			var user = rawUser.dataValues;
			if(!bcrypt.compareSync(password, user.hashed_password))
			throw new Error(INVALID_PASSWORD);

			var token = createSessionToken();
			return rawUser.createSession({
				token: token
			})
			.then(function(session) {
				return session.dataValues.token;
			});
		});
	});
}
//Given a sessionId, return a user in a promise
function getUserFromSessionId(sessionId) {
	return dbinit.then(function(initDB) {
		return initDB.Session.findOne({
			include:[initDB.User],
			where: {
				token: sessionId,
        createdAt: {
          $gt: expireDate()
        }
			}
		}).then(function(res) {
      if (!res)
      throw new Error(INVALID_SESSIONID);

			return res.dataValues.user;
		});
	});
}

module.exports = {
  createNewUser: createNewUser,
  login: login,
  getUserFromSessionId: getUserFromSessionId,
  SESSION_LENGTH: SESSION_LENGTH,
  USR_NOT_FOUND: USR_NOT_FOUND,
  INVALID_PASSWORD: INVALID_PASSWORD,
  INVALID_SESSIONID: INVALID_SESSIONID
}
