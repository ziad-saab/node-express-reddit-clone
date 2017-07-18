'use strict';
var bcrypt = require('bcrypt-as-promised');
var HASH_ROUNDS = 10;

class RedditAPI {
    constructor(conn) {
        this.conn = conn;
    }

    createUser(user) {
        /*
        first we have to hash the password. we will learn about hashing next week.
        the goal of hashing is to store a digested version of the password from which
        it is infeasible to recover the original password, but which can still be used
        to assess with great confidence whether a provided password is the correct one or not
         */
        return bcrypt.hash(user.password, HASH_ROUNDS)
            .then(hashedPassword => {
                return this.conn.query(
                    `
                    INSERT INTO users (username, password, createdAt, updatedAt)
                    VALUES (?, ?, NOW(), NOW())
                    --ON DUPLICATE KEY UPDATE updatedAt=NOW()
                    `,
                    [user.username, hashedPassword]
                );
            })
            .then(result => {
                return result.insertId;
            })
            .catch(error => {
                // Deprecated: Special error handling for duplicate entry
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new Error('A user with this username already exists');
                }
                else {
                    throw error;
                }
            });
    }

    createPost(post) {
        if (post.subredditId === undefined) {
            throw new Error('subredditId is missing');
        }
        else {
            return this.conn.query(
                `
                INSERT INTO posts (redditName, subredditId, userId, title, url, permanentLink, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
                `,
                [post.redditName, post.subredditId, post.userId, post.title, post.url, post.permanentLink]
            )
            .then(result => {
                return result.insertId;
            });
        }
    }

    createSubreddit(subreddit) {
        return this.conn.query(
            `
            INSERT INTO subreddits(redditName, name, description, createdAt, updatedAt)
            VALUES (?, ?, ?, NOW(), NOW())
            `,
            [subreddit.redditName, subreddit.name, subreddit.description]
        )
        .then(result => {
            return result.insertId;
        })
        .catch(error => {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('A subreddit with this name already exists');
            }
            else {
                throw error;
            }
        });
    }
    
    createVote(vote) {
        //Need to complete logic to validate voteDirection value
        switch (vote.voteDirection) {
            case -1:
            case 0:
            case 1:
                return this.conn.query(
                    `
                    INSERT INTO votes (userId, postId, voteDirection, createdAt, updatedAt)
                    VALUES (?, ?, ?, NOW(), NOW())
                    ON DUPLICATE KEY UPDATE voteDirection=?, updatedAt=NOW()
                    `,
                    [vote.userId, vote.postId, vote.voteDirection, vote.voteDirection]
                );
            default:
                throw Error('Vote direction is not a valid value (-1,0,1)');
        }
    }
    
    createComment(comment) {
        return this.conn.query(
            `
            INSERT INTO comments (parentId, userId, postId, text, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, NOW(), NOW())
            `,
            [comment.parentId, comment.userId, comment.postId, comment.text]
        )
        .then(result => {
            return result.insertId;
        })
        .catch(error => {
            throw new Error("Something went wrong...");
        });
    }
    
    getAllPosts(subredditId) {
        /*
        strings delimited with ` are an ES2015 feature called "template strings".
        they are more powerful than what we are using them for here. one feature of
        template strings is that you can write them on multiple lines. if you try to
        skip a line in a single- or double-quoted string, you would get a syntax error.

        therefore template strings make it very easy to write SQL queries that span multiple
        lines without having to manually split the string line by line.
         */
         var queryStr = `
            SELECT p.id
            , p.redditName
            , p.title
            , p.url
            , p.permanentLink
            , p.createdAt
            , p.updatedAt
            , p.subredditId
            , s.redditName AS subredditRedditName
            , s.name AS subredditName
            , s.description AS subredditDescription
            , s.createdAt AS subredditCreatedAt
            , s.updatedAt AS subredditUpdatedAt
            , p.userId
            , u.username
            , u.createdAt AS userCreatedAt
            , u.updatedAt AS userUpdatedAt
            , SUM(v.voteDirection) AS voteScore
            FROM posts p
            JOIN users u ON p.userId = u.id
            LEFT JOIN subreddits s ON p.subredditId = s.id
            LEFT JOIN votes v ON p.id = v.postId`;
        
        if (subredditId !== undefined) {
            queryStr += `
            WHERE s.id = ` + subredditId;
        }
        
        queryStr += `
        GROUP BY 
            p.id
            , p.redditName
            , p.title
            , p.url
            , p.permanentLink
            , p.createdAt
            , p.updatedAt
            , p.subredditId
            , s.redditName
            , s.name
            , s.description
            , s.createdAt
            , s.updatedAt
            , p.userId
            , u.username
            , u.createdAt
            , u.updatedAt
            ORDER BY p.createdAt DESC
            LIMIT 25`;
        
        //console.log(queryStr);
        return this.conn.query(queryStr)
        // Map the denormalized info into postObject(userObject) as requested
        .then(result => {
            return result.map(function(post) {
                return {
                    id: post.id,
                    redditName: post.redditName,
                    title: post.title,
                    url: post.url,  
                    permanentLink: post.permanentLink,
                    voteScore: post.voteScore,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    subreddit: {
                        id: post.subredditId,
                        redditName: post.subredditRedditName,
                        name: post.subredditName,
                        description: post.subredditDescription,
                        createdAt: post.subredditCreatedAt,
                        updatedAt: post.subredditUpdatedAt
                    },
                    user: {
                        id: post.userId,
                        username: post.username,
                        createdAt: post.userCreatedAt,
                        updatedAt: post.userUpdatedAt
                    }
                };
            });
        });
    }

    getAllSubreddits() {
        return this.conn.query(
            `
            SELECT id
            , redditName
            , name
            , description
            , createdAt
            , updatedAt
            FROM subreddits
            ORDER BY createdAt DESC
            `
        )
        .then(result => {
            return result.map(function(subreddit){
                return {
                    id: subreddit.id,
                    redditName: subreddit.redditName,
                    name: subreddit.name,
                    description: subreddit.description,
                    createdAt: subreddit.createdAt,
                    updatedAt: subreddit.updatedAt
                };
            });
        });
    }
    
    getSubredditByName(name) {
        //console.log("Subreddit Name=", name);
        return this.conn.query(
            `
            SELECT id
            , redditName
            , name
            , description
            , createdAt
            , updatedAt
            FROM subreddits
            WHERE name = ?
            `,[name]
        )
        .then(result => {
            //console.log("SubredditByName=",result);
            if (result.length === 0) {
                return null;
            }
            return {
                id: result[0].id,
                redditName: result[0].redditName,
                name: result[0].name,
                description: result[0].description,
                createdAt: result[0].createdAt,
                updatedAt: result[0].updatedAt
            };
        })
    }
    
    getAllUsers(){
        return this.conn.query(
            `
            SELECT id
            , username
            , createdAt
            , updatedAt
            FROM users
            ORDER BY createdAt DESC
            `
        )
        .then(result => {
            return result.map(function(user){
               return {
                   id: user.id,
                   username: user.username,
                   createdAt: user.createdAt,
                   updatedAt: user.updatedAt
               };
            });
        });
    }
    
    // Get comments for a specific post
    getCommentsForPost(postId, levels, parentIdArray, commentObjectArray) {
        var currentCommentObjectArray = [];
        
        function appendCommentReplies(comments, replies) {
            if (replies.length === 0) {
                return comments;
            }
            else if (comments.length === 0) {
                return replies;
            }
            else {
                for (var i in comments) {
                    if (comments[i].replies !== undefined) {
                        comments[i].replies = appendCommentReplies(comments[i].replies, replies);
                    }
                    for (var j in replies) {
                        if (comments[i].id === replies[j].parentId) {
                            if (comments[i].replies === undefined) {
                                comments[i].replies = [];
                            }
                            comments[i].replies.push(replies[j]);
                        }
                    }
                }
                return comments;
            }
        }
        
        if (commentObjectArray !== undefined) {
            currentCommentObjectArray = commentObjectArray;
        }
        if (levels <= 0 || levels === undefined) {
            //console.log("Level reached. Stopping"); //Test
            return currentCommentObjectArray;
        }
        var queryStr = '';
        if (parentIdArray === undefined || parentIdArray === null) {
            queryStr = `
                SELECT id
                , parentId
                , userId
                , postId
                , text
                , createdAt
                , updatedAt
                FROM comments
                WHERE postId = ` + postId + `
                AND parentId IS NULL
                ORDER BY createdAt DESC
                `;
        }
        else {
            var parentIdString = '';
            for (var i in parentIdArray) {
                if (i > 0) {
                    parentIdString += ',';
                }
                
                parentIdString += parentIdArray[i];
            }
            queryStr = `
                SELECT id
                , parentId
                , userId
                , postId
                , text
                , createdAt
                , updatedAt
                FROM comments
                WHERE parentId IN (` + parentIdString + `)
                ORDER BY createdAt DESC
                `;
        }
        //console.log("QueryStr=" + queryStr); //Test
        //console.log("postId=" + postId + " levels=" + levels); //Test
        return this.conn.query(queryStr)
        .then(result => {
            //console.log("Result=");
            //console.log(result);
            if (result !== undefined) {
                var self = this; //Do I need this??
                var resultCommentIdArray = result.map(comment => {return comment.id});
                //console.log("commentIdArray=",resultCommentIdArray); //Test
                // Build the current level's result array of comments
                var resultCommentObjectArray = result.map(comment => {
                    return {
                        id: comment.id,
                        parentId: comment.parentId,
                        userId: comment.userId,
                        postId: comment.postId,
                        text: comment.text,
                        createdAt: comment.createdAt,
                        updatedAt: comment.updatedAt
                    };
                });
                //console.log(resultCommentObjectArray); //Test
                currentCommentObjectArray = appendCommentReplies(currentCommentObjectArray, resultCommentObjectArray);

                //console.log("commentObjectArray=", resultCommentObjectArray); //Test
                if (resultCommentIdArray.length > 0 && levels > 0) {
                    //Need to go check if the current comments retrieved have replies if there's levels left.
                    return self.getCommentsForPost(postId, levels - 1, resultCommentIdArray, currentCommentObjectArray);
                } else {
                    return currentCommentObjectArray;
                }
            }
            else {
                return currentCommentObjectArray;
            }
        });
    }
    
    checkUserLogin(username, password) {
        //return Promise.reject(new Error("TODO: You have to implement the RedditAPI.checkUserLogin function."))

        return this.conn.query(`SELECT id, username, password, createdAt, updatedAt FROM users WHERE username=?`, [username])
        .then(result => {
            //console.log("Result is=",result); //Test
            if (result === undefined) {
                throw new Error('username or password incorrect');
            }
            else if (result.length > 1) {
                throw new Error("WTF?");
            }
            else {
                return bcrypt.compare(password, result[0].password)
                .then(passOk => {
                    return {
                        id: result[0].id,
                        username: result[0].username,
                        createdAt: result[0].createdAt,
                        updatedAt: result[0].updatedAt
                    };
                })
                .catch(error => {
                    //console.log("Error=",error); //Test
                    if (error.name === 'MismatchError') {
                        throw new Error('username or password incorrect');
                    }
                    throw new Error('unknown error', error);
                });
            }
        });
        /*
        Here are the steps you should follow:

            1. Find an entry in the users table corresponding to the input username
                a. If no user is found, make your promise throw an error "username or password incorrect".
                b. If you found a user, move to step 2
            2. Use the bcrypt.compare function to check if the database's hashed password matches the input password
                a. if it does, make your promise return the full user object minus the hashed password
                b. if it doesn't, make your promise throw an error "username or password incorrect"
         */
    }

    createUserSession(userId) {
        //return Promise.reject(new Error("TODO: You have to implement the RedditAPI.createUserSession function."))
        var userToken;
        return bcrypt.genSalt(10)
        .then(token => {
            userToken = token;
            return this.conn.query(`INSERT INTO sessions(userId, token) VALUES(?,?)`, [userId, token]);
        })
        .then(result => {
            //console.log('SessionId=',result);
            return {
                sessionId: result.id,
                username: result.username,
                token: userToken
            };
        });
        /*
         Here are the steps you should follow:

         1. Use bcrypt's genSalt function to create a random string that we'll use as session id (promise)
         2. Use an INSERT statement to add the new session to the sessions table, using the input userId
         3. Once the insert is successful, return the random session id generated in step 1
         */
    }

    getUserFromSession(sessionId) {
        //return Promise.reject(new Error("TODO: You have to implement the RedditAPI.getUserFromSession function."));
        return this.conn.query(`
        SELECT s.userId
        , u.username
        , u.createdAt
        , u.updatedAt
        FROM sessions s
        JOIN users u ON s.userId = u.id
        WHERE s.token = ?
        `,[sessionId])
        .then(result => {
            //console.log('Session=',result[0]); //Test
            return {
                userId: result[0].userId,
                username: result[0].username,
                createdAt: result[0].createdAt
            };
        });
    }
    
}

module.exports = RedditAPI;