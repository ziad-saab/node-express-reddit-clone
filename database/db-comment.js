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
        user.addCommentvote(newComment, {upVote: true});
        content.addComment(newComment);
        return {comment: newComment, user: user, content: content};
      });
    });
  });
}

function getCommentsAndScoresForUser(sessionId, username, n, m) {
  return getUserFromSessionId(sessionId)
  .then(function(user) {
    return Promise.all([
      getCommentsForUser(user, username, n, m),
      getCommentScoresForUserName(username)
    ])
    .then(function(response) {
      return {
        user: user.toJSON(),
        comments: response[0].map(i => i.toJSON()),
        commentScores: response[1].map(i => i.toJSON())
      }
    });
  })
  .catch(function(e) {
    return Promise.all([
      getCommentsForUser({}, username, n, m),
      getCommentScoresForUserName(username)
    ])
    .then(function(response) {
      return {
        comments: response[0].map(i => i.toJSON()),
        commentScores: response[1].map(i => i.toJSON())
      }
    });
  })
}

//Gets all comments for the provided userId, with a limit of n offset by m
function getCommentsForUser(user, username, n, m) {
  return dbinit.then(function(initDB) {
    return initDB.Comment.findAll({
      include: [{model: initDB.User, where: {username: username}},
      {model: initDB.CommentVote, as: 'usercommentvotes', where: {userId: user.id}, required: false}],
      order: [[initDB.Sequelize.col('createdAt'), 'DESC']],
      limit: n,
      offset: m
    });
  });
}
function getCommentScoresForUserName(username) {
  return dbinit.then(function(initDB) {
    return initDB.User.findOne({
      where: {username: username}
    })
    .then(function(user) {
      return getCommentScoresForUser(user);
    });
  });
}
function getCommentScoresForUser(user) {
  return dbinit.then(function(initDB) {
    return initDB.Comment.findAll({
      include: [{
        model: initDB.CommentVote,
        attributes: []
      }],
      where: {userId: user.id},
      group: 'comment.id',
      attributes: {
          include: [
            [initDB.Sequelize.literal('SUM(IF((`commentvotes`.`upVote` IS NOT NULL), IF(`commentvotes`.`upVote`, 1, -1), 0))'), 'voteScore']
          ]
        }
    });
  });
}
//Gets a content and all comments associated with the content, up to a nested
//depth of 10
function getContentAndCommentsForSession(sessionId, contentId, commentId) {
  return dbinit.then(function(initDB) {
    return getUserFromSessionId(sessionId)
    .then(function(user) {
      return getContentAndCommentsForUser(user.toJSON(), contentId, commentId);
    })
    .catch(function(e) {
      return getContentAndCommentsForUser({}, contentId, commentId);
    });
  });
};

function getContentAndCommentsForUser(user, contentId, commentId) {
  return dbinit.then(function(initDB) {
    return Promise.all([
      initDB.Content.findById(contentId),
      getCommentsForContent(user, contentId, commentId),
      getContentVoteScore(contentId),
      getCommentScores(contentId)
    ])
    .then(function(response) {
      var content = response[0]
      var comments = response[1];
      var votescore = response[2];
      var commentScores = response[3];
      var findVote = initDB.Vote.findOne({
        where: {
          userId: user.id,
          contentId: content.id
        }
      })
      return Promise.all([findVote, content.getUser()])
      .then(function(response) {
        var vote = {};
        if (response[0])
        vote = response[0].toJSON();
        content = content.toJSON();
        content.commentCount = commentScores.length
        return {
          user: user,
          submitter: response[1].toJSON(),
          content: content,
          comments: comments,
          vote: vote,
          votescore: votescore,
          commentScores: commentScores.map(i => i.toJSON())
        }
      });
    });
  });
}

//provides a nested comment query with a depth of n
function getNCommentLevels(user, n, initDB) {
  if (n <= 0)
  return [{
    model: initDB.User,
    attributes: { include: [[initDB.Sequelize.literal('true'), 'the_end']] }
  }, {
    model: initDB.CommentVote,
    as: 'usercommentvotes',
    where: {userId: user.id},
    required: false
  }];
  else return [initDB.User, {
    model: initDB.CommentVote,
    as: 'usercommentvotes',
    where: {userId: user.id},
    required: false
  },{
    model: initDB.Comment,
    as: 'children',
    include: getNCommentLevels(user, n-1, initDB)
  }]
}
//gets all comments for a content up to a depth of 10
function getCommentsForContent(user, contentId, parentId) {
  return dbinit.then(function(initDB) {
    var where = {contentId: contentId}
    if (!parentId)
    where.parentId = null;
    else where.id = parentId;
    return initDB.Comment.findAll({
      include: getNCommentLevels(user, 10, initDB),
      where: where
    })
    .then(function(comments) {
      return comments.map(i => i.toJSON());
    });
  });
}
function getCommentScores(contentId) {
  return dbinit.then(function(initDB) {
    return initDB.Comment.findAll({
      include: [{
        model: initDB.CommentVote,
        attributes: []
      }],
      where: {contentId: contentId},
      group: 'comment.id',
      attributes: {
          include: [
            [initDB.Sequelize.literal('SUM(IF((`commentvotes`.`upVote` IS NOT NULL), IF(`commentvotes`.`upVote`, 1, -1), 0))'), 'voteScore']
          ]
        }
    });
  })
}

// adds a vote to the comment for the user attached to sessionID
function voteOnComment(sessionId, commentId, isUpvote) {
  return dbinit.then(function(initDB) {
    return Promise.all([
      getUserFromSessionId(sessionId),
      initDB.Comment.findById(commentId)])
      .then(function(response) {
        var user = response[0];
        var comment = response[1];
        return user.addCommentvote(comment, {upVote: isUpvote});
      });
    });
  }

  module.exports = {
    getContentAndComments: getContentAndCommentsForSession,
    createNewComment: createNewComment,
    voteOnComment: voteOnComment,
    getCommentsAndScoresForUser: getCommentsAndScoresForUser
  }
