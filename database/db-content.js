/*
Provides the functionality for creation of new content, retrieval of content in
an ordered list, and voting on content
*/
var dbinit = require('./dbinit.js');
var database = require('./database.js');
var getUserFromSessionId = require('./db-user.js').getUserFromSessionId;
var INVALID_SESSIONID = require('./db-user.js').INVALID_SESSIONID;

//takes a sessionId, a URL, a title, creates a new content with Sequelize and
//returns the content in a promise
function createNewContent(sessionId, url, title) {
  return dbinit.then(function(initDB) {
		return getUserFromSessionId(sessionId)
		.then(function(user) {
			return initDB.Content.create({
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

//takes a sessionId, a list length n, and an offset m, and will return the n
//most controversial content, starting at position m
function getControversialNContent(sessionId, n, m) {
  var upvotes = 'Sum(IF(`votes`.`upvote`, 1, 0))';
  var downvotes = 'Sum(IF(`votes`.`upvote`, 0, 1))';
  return getOrderedNtoMContentForSession(sessionId, n, m, '(GREATEST('+ upvotes +', ' + downvotes + ') / (ABS('+upvotes+' - '+downvotes+'+0.1)))');
}
//takes a sessionId, a list length n, and an offset m, and will return the n
//hottest content, starting at position m
function getHottestNContent(sessionId, n, m) {
  var currentTime = Math.floor(Date.now() / 1000);
  var ageFactor = '(((' + currentTime + ' - UNIX_TIMESTAMP(CONVERT_TZ(`contents`.`createdAt`, \'+00:00\', @@global.time_zone))) / 3600)^2)';
  return getOrderedNtoMContentForSession(sessionId, n, m, '((Sum(IF(`votes`.`upvote`, 1, -1))) - ' + ageFactor + ')');
}

//takes a sessionId, a list length n, and an offset m, and will return the n
//top content, starting at position m
function getTopNContent(sessionId, n, m) {
  return getOrderedNtoMContentForSession(sessionId, n, m, 'Sum(IF(`votes`.`upvote`, 1, -1))');
}

//takes a sessionId, a list length n, and an offset m, and will return the n
//latest content, starting at position m
function getLatestNContent(sessionId, n, m) {
  return getOrderedNtoMContentForSession(sessionId, n, m, 'contents.createdAt');
}

//takes a sessionId, a list length n, an offset m, and a mysql expression and
//will return the top n results according to the expression, starting at
//position m
function getOrderedNtoMContentForSession(sessionId, n, m, order) {
  return dbinit.then(function(initDB) {
    return getUserFromSessionId(sessionId)
    .then(function(user) {
      return getOrderedNtoMContent(user.dataValues.id, n, m, order)
      .then(function(contentObject) {
        contentObject.User = user.toJSON();
        return contentObject;
      });
    })
    .catch(function(e) {
      if(e.message !== INVALID_SESSIONID) {
        throw e;
    }

      return getOrderedNtoMContent(null, n, m, order);
    });
  });
}
//takes a userId, a list length n, an offset m, and a mysql expression and
//will return the top n results according to the expression, starting at
//position m
function getOrderedNtoMContent(userId, n, m, order) {
  return dbinit.then(function(initDB) {
    return initDB.db.query(
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
            ORDER BY        `postorder` DESC) AS contentlist \
LEFT OUTER JOIN `votes` AS `uservotes` \
ON              `uservotes`.`contentid`=`contentlist`.`id` \
AND             `uservotes`.`userid`='+ userId +' \
GROUP BY        `contentlist`.`id` \
ORDER BY        `contentlist`.`postorder` DESC, `contentlist`.`createdAt` DESC \
LIMIT ' + n + ' \
OFFSET '+ m +';',
    { type: initDB.Sequelize.QueryTypes.SELECT});
  }).then(function(contents) {
    return {
      Content: contents
    }
  });
}

// adds a vote to the content for the user attached to sessionID
function voteOnContent(sessionId, contentId, isUpvote) {
  return dbinit.then(function(initDB) {
    return Promise.all([
      getUserFromSessionId(sessionId),
      initDB.Content.findById(contentId)])
      .then(function(response) {
        var user = response[0];
        var content = response[1];
        return user.addUpvote(content, {upVote: isUpvote});
      });
    });
  }

module.exports = {
  createNewContent: createNewContent,
  voteOnContent: voteOnContent,
  getLatestNContent: getLatestNContent,
  getHottestNContent: getHottestNContent,
  getControversialNContent: getControversialNContent,
  getTopNContent: getTopNContent
}
