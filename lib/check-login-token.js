/*
This middleware is setup as a function that returns a middleware closure
Since checking the login token requires access to the database through the RedditAPI,
this function receives the reddit API object and then returns a middleware.

The middleware will check request.cookies for a SESSION token. if it exists, the middleware will
check through RedditAPI if the token represents a valid user. If it does, then the user object will
be added to the request object. this means any code that runs after this middleware will have a
.user property under the request object if there is a logged in user.
 */
 
module.exports = function(myReddit) {
    return function checkLoginToken(request, response, next) {

        // By default this will be false. request.locals object can be used in HTML templates.
        response.locals.loggedInUser = false;

        // check if there's a SESSION cookie...
        if (request.cookies.SESSION) {
            console.log(request.cookies.SESSION + 'lalalla');
            myReddit.getUserFromSession(request.cookies.SESSION)
            .then(function(user) {
                // if we get back a user object, set it on the request. From now on, this request looks like it was made by this user as far as the rest of the code is concerned
                if (user) {
                    request.loggedInUser = user;
                    response.locals.loggedInUser = user; // request.locals is an object that will be available to the HTML templates
                }
                // call next to tell express to move to the next middleware
                next();
            })
            .catch(function(err) {
                console.log('BOOGAH')
                console.error('Something went wrong while checking SESSION token', err.stack);
                /*
                 even if something went wrong, call next to tell express to move to the next middleware.
                 this way we can at least serve the website as if the user was not logged in
                 */
                next();
            });
        }
        else {
            /*
            if no SESSION cookie, call next to tell express to move to the next middleware

            NOTE: it's not **bad** if the user doesn't have a SESSION token. All it means is that
            they are not currently logged in. Most users of a publicly available site
            will not be logged in when accessing the site.
             */
             
            next();
        }
    }
};