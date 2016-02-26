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
function getContentAndCommentsForSession(sessionId, contentId) {
  return dbinit.then(function(initDB) {
    return getUserFromSessionId(sessionId)
    .then(function(user) {
      return getContentAndCommentsForUser(user.toJSON(), contentId);
    })
    .catch(function(e) {
      return getContentAndCommentsForUser({}, contentId);
    });
  });
};

function getContentAndCommentsForUser(user, contentId) {
  return dbinit.then(function(initDB) {
    return Promise.all([
      initDB.Content.findById(contentId),
      getCommentsForContent(user, contentId),
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
        return {
          user: user,
          submitter: response[1].toJSON(),
          content: content.toJSON(),
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
  return [initDB.User, {
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
function getCommentsForContent(user, contentId) {
  return dbinit.then(function(initDB) {
    return initDB.Comment.findAll({
      include: getNCommentLevels(user, 10, initDB),
      where: {
        contentId: contentId,
        parentId: null
      }
    })
    .then(function(comments) {
      getArrayVoteScores(comments).then(console.log);
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

function getArrayVoteScores(commentArray) {
  return dbinit.then(function(initDB) {
    if (commentArray.length === 0)
    return [];

    var voteQueries = commentArray.map(getCommentVoteScores)
    return Promise.all(voteQueries);
  });
}
function getCommentVoteScores(comment) {
  return dbinit.then(function(initDB) {
    return comment.getCommentvotes()
    .then(function(votes) {
      if (!comment.children)
      return {
        votes: votes
      }

      else {
        return getArrayVoteScores(comment.children)
        .then(function(response) {
          return {
            votes: votes,
            childVotes: response
          }
        });
      }
    });
  });
}
/*
//takes a commentTree, and returns a new tree with votescores.
function getVoteScores(commentTree) {
return dbinit.then(function(initDB) {
if (commentTree.length === 0)
return [];
else {
var commentQueries = commentTree.map(function(child) {
getVoteScores(child);
});
return Promise.all(commentQueries)
.then(function(votes) {
if (!commentTree.children)
return {
votes: votes
}
var commentSubqueries = commentTree.children.map(function(child) {
getVoteScores(child);
});
return Promise.all(commentSubqueries)
.then(function(childvotes) {
return {
votes: votes,
children: childvotes
}
});
});
}
});
}
*/
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
    voteOnComment: voteOnComment
  }
