module.exports = function(db) {
    return {
        checkLoginToken: function(req, res, next) {
            if (req.cookies.loginToken) {
                db.session.findOne({
                    where: {
                        token: req.cookies.loginToken
                    },
                    include: db.user // so we can add it to the request
                }).then(
                    function(session) {
                        // session will be null if no token was found
                        if (session) {
                            req.loggedInUser = session.User;
                        }
                        // No matter what, we call `next()` to move on to the next handler
                        next();
                    },
                    function(e) {
                        console.log(e);
                        next();
                    }
                );
            }
            else {
                next();
            }
        }
    };
};