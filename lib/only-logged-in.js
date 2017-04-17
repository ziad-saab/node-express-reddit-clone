/*
This module exports a middleware that will check whether ther's a logged in user or not.
This middleware uses request.user to check if a user is logged in. request.user is filled in
by the checkLoginToken middleware.

This middleware is not meant to be used on every request, but only those requests that require
a logged in user. Examples are creating a new post and voting on a post.
 */
module.exports = function(request, response, next) {
    if (request.user) {
        next();
    }
    else {
        response.status(401);
        response.render('unauthorized');
    }
};