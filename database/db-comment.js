var dbinit = require('./dbinit.js');
var getUserFromSessionId = require('./db-user.js').getUserFromSessionId;

//creates a new comment
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
      });
    });
  });
}

function getContentAndComments(sessionId, contentId) {
  return dbinit.then(function(initDB) {
    return Promise.all([
      getUserFromSessionId(sessionId),
      initDB.Content.findById(contentId),
      getCommentsForContent(contentId)
    ])
    .then(function(response) {
      return {
        user: response[0].toJSON(),
        content: response[1].toJSON(),
        comments: response[2]
      }
    });
  });
};

function getCommentsForContent(contentId) {
  return dbinit.then(function(initDB) {
    return initDB.Comment.findAll({
      include: {
        model: initDB.Comment,
        as: 'children',
        include: {
          model: initDB.Comment,
          as: 'children'
        }
      },
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
