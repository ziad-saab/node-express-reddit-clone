var dbUser = require('./db-user.js');
var dbContent = require('./db-content.js');
var dbComment = require('./db-comment.js');


module.exports = {
  createNewUser: dbUser.createNewUser,
	login: dbUser.login,
	postContent: dbContent.createNewContent,
	getLatestNContent: dbContent.getLatestNContent,
	getHottestNContent: dbContent.getHottestNContent,
  getControversialNContent: dbContent.getControversialNContent,
  getTopNContent: dbContent.getTopNContent,
	voteOnContent: dbContent.voteOnContent,
  getContentAndComments: dbComment.getContentAndComments,
  createNewComment: dbComment.createNewComment,
  SESSION_LENGTH: dbUser.SESSION_LENGTH,
  USR_NOT_FOUND: dbUser.USR_NOT_FOUND,
  INVALID_PASSWORD: dbUser.INVALID_PASSWORD,
  INVALID_SESSIONID: dbUser.INVALID_SESSIONID
}
