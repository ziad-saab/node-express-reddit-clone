var db = require('mysql-promise')();
var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');
var secureRandom = require('secure-random');
var username = require('./config.json').username;

//constants
const SESSION_LENGTH = 24;
const USR_NOT_FOUND = 'User not found';
const INVALID_PASSWORD = 'Invalid password';
const INVALID_SESSIONID = 'Invalid sessionID';

function createSessionToken() {
    return secureRandom.randomArray(40).map(code => code.toString(16)).join('')
}
//hold for 24 hours
function expireDate() {
  var date = new Date(Date.now());
  date.setUTCHours(date.getUTCHours() - SESSION_LENGTH);
  return date;
}

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

	return db.sync();
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
		return User.findOne({
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
//Given a sessionId, return
function getUserFromSessionId(sessionId) {
	return dbInit.then(function() {
		return Session.findOne({
			include:[User],
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
/* takes a sessionId, a URL, a title, creates a new content with Sequelize and returns the content in a promise
*/
function createNewContent(sessionId, url, title) {
  return dbInit.then(function() {
		return getUserFromSessionId(sessionId)
		.then(function(user) {
			return Content.create({
	      url: url,
	      title: title
			})
			.then(function(content) {
		    user.addContent(content);
		    return content;
			});
		});
	});
}

function getHottestNContent(sessionId, n) {
  var votescore = Sequelize.fn('SUM', Sequelize.fn('IF', Sequelize.col('votes.upVote'), 1, -1));
  var count = Sequelize.fn('COUNT', Sequelize.col('votes.upVote'));
  Sequelize.col('content.createdAt');
  var v = Sequelize.literal('');
  return getFunctionNContent(sessionId, n, votescore / count
  );
}


function getControversialNContent(sessionId, n) {
  return getOrderedNtoMContentForSession(sessionId, n, 0, 'Sum(IF(`votes`.`upvote`, 1, 0)) / Sum(IF(`votes`.`upvote`, 1, 1))');
}
function getHottestNContent(sessionId, n) {
  var currentTime = Math.floor(Date.now() / 1000);
  var ageFactor = '((' + currentTime + ' - UNIX_TIMESTAMP(CONVERT_TZ(`contents`.`createdAt`, \'+00:00\', @@global.time_zone))) / 10000)';
  return getOrderedNtoMContentForSession(sessionId, n, 0, '((Sum(IF(`votes`.`upvote`, 1, -1))) / ' + ageFactor + ')');
}

function getTopNContent(sessionId, n) {
  return getOrderedNtoMContentForSession(sessionId, n, 0, 'Sum(IF(`votes`.`upvote`, 1, -1))');
}
function getLatestNContent(sessionId, n) {
  return getOrderedNtoMContentForSession(sessionId, n, 0, 'contents.createdAt');
}
function getOrderedNtoMContentForSession(sessionId, n, m, order) {
  return dbInit.then(function() {
    return getUserFromSessionId(sessionId)
    .then(function(user) {
      return getOrderedNtoMContent(user.dataValues.id, n, m, order)
      .then(function(contentObject) {
        contentObject.User = user.toJSON();
        return contentObject;
      });
    })
    .catch(function(e) {
      if(e.message !== INVALID_SESSIONID)
      throw e;

      return getOrderedNtoMContent(null, n, m, order);
    });
  });
}
function getOrderedNtoMContent(userId, n, m, order) {
  return dbInit.then(function() {
    return db.query(
      'SELECT          `contentlist`.*, `uservotes`.`upvote` AS `upvote` \
FROM  (     SELECT          `contents`.*, \
                            `users`.`username`               AS `submitter`, \
                            ' + order + '                    AS `postorder`, \
                            sum(IF(`votes`.`upvote`, 1, -1)) AS `votescore` \
            FROM            `contents` \
            LEFT OUTER JOIN `votes` AS `votes` \
            ON              `contents`.`id` = `votes`.`contentid` \
            LEFT OUTER JOIN `users` AS `users` \
            ON              `contents`.`userid` = `users`.`id` \
            GROUP BY        `contents`.`id` \
            ORDER BY        `postorder` DESC limit ' + n + ' offset '+ m +') AS contentlist \
LEFT OUTER JOIN `votes`                                                                           AS `uservotes` \
ON              `uservotes`.`contentid`=`contentlist`.`id` \
AND             `uservotes`.`userid`='+ userId +' \
GROUP BY        `contentlist`.`id` \
ORDER BY        `contentlist`.`postorder` DESC;',
    { type: Sequelize.QueryTypes.SELECT});
  }).then(function(contents) {
    return {
      Content: contents
    }
  });
}

function voteOnContent(sessionId, contentId, isUpvote) {
  return Promise.all([
    getUserFromSessionId(sessionId),
    Content.findById(contentId)])
    .then(function(response) {
      var user = response[0];
      var content = response[1];
      return user.addUpvote(content, {upVote: isUpvote});
    });
  }
module.exports = {
	createNewUser: createNewUser,
	login: login,
	postContent: createNewContent,
	getLatestNContent: getLatestNContent,
	getHottestNContent: getHottestNContent,
	voteOnContent: voteOnContent,
  USR_NOT_FOUND: USR_NOT_FOUND,
  INVALID_PASSWORD: INVALID_PASSWORD,
  INVALID_SESSIONID: INVALID_SESSIONID
};
