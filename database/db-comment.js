/*
This file provides database functionality for the creation of new comments, and
their retrieval
*/
var dbinit = require('./dbinit.js');
var getUserFromSessionId = require('./db-user.js').getUserFromSessionId;
var getContentVoteScore = require('./db-content.js').getVoteScore;

//creates a new comment linked to a user and a content, and optionally a parent
//comment
function createNewComment(sessionId, contentId, parentCommentId, text) {
  return dbinit.then(function(initDB) {
    return Promise.all([
      getUserFromSessionId(sessionId),
      initDB.Content.findById(contentId),
      initDB.Comment.findById(parentCommentId)
    ])
    .then(function(response) {
      var user = response[0];
      var content = response[1];
      var comment = response[2];
      return initDB.Comment.create({
        text: text
      })
      .then(function(newComment) {
        if(comment)
        comment.addChildren(newComment);
        user.addComment(newComment);
        content.addComment(newComment);
        return {comment: newComment, user: user, content: content};
      });
    });
  });
}

//Gets a content and all comments associated with the content, up to a nested
//depth of 10
function getContentAndComments(sessionId, contentId) {
  return dbinit.then(function(initDB) {
    return Promise.all([
      getUserFromSessionId(sessionId),
      initDB.Content.findById(contentId),
      getCommentsForContent(contentId),
      getContentVoteScore(contentId)
    ])
    .then(function(response) {
      var user = response[0];
      var content = response[1]
      var comments = response[2];
      var votescore = response[3];
      var findVote = initDB.Vote.findOne({
        where: {
          userId: user.id,
          contentId: content.id
        }
      })
      return Promise.all([findVote, content.getUser()])
      .then(function(response) {
        return {
          user: user.toJSON(),
          submitter: response[1].toJSON(),
          content: content.toJSON(),
          comments: comments,
          vote: response[0].toJSON(),
          votescore: votescore
        }
      });
    });
  });
};

//provides a nested comment query with a depth of n
function getNCommentLevels(n, initDB) {
  if (n <= 0)
  return [initDB.User];
  else return [initDB.User, {
    model: initDB.Comment,
    as: 'children',
    include: getNCommentLevels(n-1, initDB)
  }]
}

//gets all comments for a content up to a depth of 10
function getCommentsForContent(contentId) {
  return dbinit.then(function(initDB) {
    return initDB.Comment.findAll({
      include: getNCommentLevels(10, initDB),
      where: {
        contentId: contentId,
        parentId: null
      }
    })
    .then(function(comments) {
      return comments.map(i => i.toJSON());
    })
  });
}

module.exports = {
  getContentAndComments: getContentAndComments,
  createNewComment: createNewComment
}
