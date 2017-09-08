"use strict";
//THING I LEARNED
//with this in javascript, if NOT using arrow function for callback (result => {})
//and using (function(result){}) (legacy code), 
//the context of this is not preserved if we are using .then()
//HACK: declare (var that = this) at the top and use that
//that now references the same instance/object everytime 

var bcrypt = require('bcrypt-as-promised');
var HASH_ROUNDS = 10;

// This is a helper function to map a flat post to nested post
function transformPost(post) {
    //return {
    var post ={
        id: post.posts_id,
        title: post.posts_title,
        url: post.posts_url,
        createdAt: post.posts_createdAt,
        updatedAt: post.posts_updatedAt,
        voteScore: post.voteScore,
        numUpvotes: post.numUpvotes,
        numDownvotes: post.numDownvotes,

        user: {
            id: post.users_id,
            username: post.users_username,
            createdAt: post.users_createdAt,
            updatedAt: post.users_updatedAt
        },
        subreddit: {
            id: post.subreddits_id,
            name: post.subreddits_name,
            description: post.subreddits_description,
            createdAt: post.subreddits_createdAt,
            updatedAt: post.subreddits_updatedAt
        }
    }
    //console.log(post);
    return post;
    
}

class RedditAPI {
    constructor(conn) {
        this.conn = conn;
    }

    /*
    user should have username and password
     */
    createUser(user) {
        /*
         first we have to hash the password. we will learn about hashing next week.
         the goal of hashing is to store a digested version of the password from which
         it is infeasible to recover the original password, but which can still be used
         to assess with great confidence whether a provided password is the correct one or not
         */
        return bcrypt.hash(user.password, HASH_ROUNDS)
        .then(hashedPassword => {
            return this.conn.query('INSERT INTO users (username, password, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())', [user.username, hashedPassword]);
        })
        .then(result => {
            return result.insertId;
        })
        .catch(error => {
            // Special error handling for duplicate entry
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('A user with this username already exists');
            }
            else {
                throw error;
            }
        });
    }

    /*
    post should have userId, title, url, subredditId
     */
    createPost(post) {
        if (!post.subredditId) {
            return Promise.reject(new Error("There is no subreddit id"));
        }

        return this.conn.query(
            `
                INSERT INTO posts (userId, title, url, createdAt, updatedAt, subredditId)
                VALUES (?, ?, ?, NOW(), NOW(), ?)`,
            [post.userId, post.title, post.url, post.subredditId]
        )
        .then(result => {
            return result.insertId; //insertId = post id as id is NOT NULL AUTO INCREMENT KEY
        });
    }

    //NTS: taking a parameter OBJECT 
    //that has properties like name (for subreddits) and sortMethod (for sort)
    //NOTE: TOO MUCH REDUNDANCY, refactor it later
    getAllPosts(parameter) {
        /*
         strings delimited with ` are an ES2015 feature called "template strings".
         they are more powerful than what we are using them for here. one feature of
         template strings is that you can write them on multiple lines. if you try to
         skip a line in a single- or double-quoted string, you would get a syntax error.

         therefore template strings make it very easy to write SQL queries that span multiple
         lines without having to manually split the string line by line.
         */
        //console.log(parameter);
        return Promise.resolve(parameter) //the result of the Promise.resolve() is parameter
            .then(parameter => {
            console.log('Parameter is:' + parameter);
            if (parameter === undefined)
            {
                console.log("HomePage/ The Parameter is: " + parameter);
                return this.conn.query(
                    `
                    SELECT
                        p.id AS posts_id,
                        p.title AS posts_title,
                        p.url AS posts_url,
                        p.createdAt AS posts_createdAt,
                        p.updatedAt AS posts_updatedAt, 
                        
                        u.id AS users_id,
                        u.username AS users_username,
                        u.createdAt AS users_createdAt,
                        u.updatedAt AS users_updatedAt,
                        
                        s.id AS subreddits_id,
                        s.name AS subreddits_name,
                        s.description AS subreddits_description,
                        s.createdAt AS subreddits_createdAt,
                        s.updatedAt AS subreddits_updatedAt,
                    
                        COALESCE(SUM(v.voteDirection), 0) AS voteScore,
                        SUM(IF(v.voteDirection = 1, 1, 0)) AS numUpvotes,
                        SUM(IF(v.voteDirection = -1, 1, 0)) AS numDownvotes
                        
                    FROM posts p
                        JOIN users u ON p.userId = u.id
                        JOIN subreddits s ON p.subredditId = s.id
                        LEFT JOIN votes v ON p.id = v.postId
                        
                        GROUP BY p.id
                        ORDER BY p.createdAt DESC
                        LIMIT 25`);
            }
            else if (parameter.hasOwnProperty('name') && !parameter.hasOwnProperty('sortMethod'))
            {
                return this.conn.query(
                    `
                    SELECT
                        p.id AS posts_id,
                        p.title AS posts_title,
                        p.url AS posts_url,
                        p.createdAt AS posts_createdAt,
                        p.updatedAt AS posts_updatedAt, 
                        
                        u.id AS users_id,
                        u.username AS users_username,
                        u.createdAt AS users_createdAt,
                        u.updatedAt AS users_updatedAt,
                        
                        s.id AS subreddits_id,
                        s.name AS subreddits_name,
                        s.description AS subreddits_description,
                        s.createdAt AS subreddits_createdAt,
                        s.updatedAt AS subreddits_updatedAt,
                    
                        COALESCE(SUM(v.voteDirection), 0) AS voteScore,
                        SUM(IF(v.voteDirection = 1, 1, 0)) AS numUpvotes,
                        SUM(IF(v.voteDirection = -1, 1, 0)) AS numDownvotes
                        
                    FROM posts p
                        JOIN users u ON p.userId = u.id
                        JOIN subreddits s ON p.subredditId = s.id
                        LEFT JOIN votes v ON p.id = v.postId
                    WHERE
                        s.name = ?
                    GROUP BY p.id
                    ORDER BY p.createdAt DESC
                    LIMIT 25`, [parameter.name])
            }
            else if(parameter.hasOwnProperty('sortMethod') && !parameter.hasOwnProperty('name'))
            {
                console.log("The sort Thing worked");
                if(parameter.sortMethod === "top")
                {
                    console.log("The sort Thing TOP ");
                    return this.conn.query(
                        `SELECT
                            p.id AS posts_id,
                            p.title AS posts_title,
                            p.url AS posts_url,
                            p.createdAt AS posts_createdAt,
                            p.updatedAt AS posts_updatedAt, 
                        
                            u.id AS users_id,
                            u.username AS users_username,
                            u.createdAt AS users_createdAt,
                            u.updatedAt AS users_updatedAt,
                            
                            s.id AS subreddits_id,
                            s.name AS subreddits_name,
                            s.description AS subreddits_description,
                            s.createdAt AS subreddits_createdAt,
                            s.updatedAt AS subreddits_updatedAt,
                        
                            COALESCE(SUM(v.voteDirection), 0) AS voteScore,
                            SUM(IF(v.voteDirection = 1, 1, 0)) AS numUpvotes,
                            SUM(IF(v.voteDirection = -1, 1, 0)) AS numDownvotes
                            
                        FROM posts p
                            JOIN users u ON p.userId = u.id
                            JOIN subreddits s ON p.subredditId = s.id
                            LEFT JOIN votes v ON p.id = v.postId
                            
                        GROUP BY p.id
                        ORDER BY voteScore DESC
                        LIMIT 25`);
                }
                else if (parameter.sortMethod === "hot")
                {
                    console.log("Sort by Hot");
                    return this.conn.query(
                        `SELECT
                            p.id AS posts_id,
                            p.title AS posts_title,
                            p.url AS posts_url,
                            p.createdAt AS posts_createdAt,
                            p.updatedAt AS posts_updatedAt, 
                        
                            u.id AS users_id,
                            u.username AS users_username,
                            u.createdAt AS users_createdAt,
                            u.updatedAt AS users_updatedAt,
                            
                            s.id AS subreddits_id,
                            s.name AS subreddits_name,
                            s.description AS subreddits_description,
                            s.createdAt AS subreddits_createdAt,
                            s.updatedAt AS subreddits_updatedAt,
                        
                            COALESCE(SUM(v.voteDirection), 0) AS voteScore,
                            SUM(IF(v.voteDirection = 1, 1, 0)) AS numUpvotes,
                            SUM(IF(v.voteDirection = -1, 1, 0)) AS numDownvotes
                            
                        FROM posts p
                            JOIN users u ON p.userId = u.id
                            JOIN subreddits s ON p.subredditId = s.id
                            LEFT JOIN votes v ON p.id = v.postId
                            
                        GROUP BY p.id
                        ORDER BY (COALESCE(SUM(v.voteDirection),0)/ (NOW() - p.createdAt)) DESC
                        LIMIT 25`);
                }
            }
            else if (parameter.hasOwnProperty('name') && parameter.hasOwnProperty('sortMethod'))
            {
                console.log(parameter.name);
                console.log(parameter.sortMethod);
                if(parameter.sortMethod === "top")
                {
                    //console.log("The sort Thing TOP ");
                    return this.conn.query(
                        `SELECT
                            p.id AS posts_id,
                            p.title AS posts_title,
                            p.url AS posts_url,
                            p.createdAt AS posts_createdAt,
                            p.updatedAt AS posts_updatedAt, 
                        
                            u.id AS users_id,
                            u.username AS users_username,
                            u.createdAt AS users_createdAt,
                            u.updatedAt AS users_updatedAt,
                            
                            s.id AS subreddits_id,
                            s.name AS subreddits_name,
                            s.description AS subreddits_description,
                            s.createdAt AS subreddits_createdAt,
                            s.updatedAt AS subreddits_updatedAt,
                        
                            COALESCE(SUM(v.voteDirection), 0) AS voteScore,
                            SUM(IF(v.voteDirection = 1, 1, 0)) AS numUpvotes,
                            SUM(IF(v.voteDirection = -1, 1, 0)) AS numDownvotes
                            
                        FROM posts p
                            JOIN users u ON p.userId = u.id
                            JOIN subreddits s ON p.subredditId = s.id 
                            LEFT JOIN votes v ON p.id = v.postId
                        WHERE 
                            s.name = ?
                        GROUP BY p.id
                        ORDER BY voteScore DESC
                        LIMIT 25`,[parameter.name]);
                }
                else if (parameter.sortMethod === "hot")
                {
                    console.log("Sort by Hot");
                    return this.conn.query(
                        `SELECT
                            p.id AS posts_id,
                            p.title AS posts_title,
                            p.url AS posts_url,
                            p.createdAt AS posts_createdAt,
                            p.updatedAt AS posts_updatedAt, 
                        
                            u.id AS users_id,
                            u.username AS users_username,
                            u.createdAt AS users_createdAt,
                            u.updatedAt AS users_updatedAt,
                            
                            s.id AS subreddits_id,
                            s.name AS subreddits_name,
                            s.description AS subreddits_description,
                            s.createdAt AS subreddits_createdAt,
                            s.updatedAt AS subreddits_updatedAt,
                        
                            COALESCE(SUM(v.voteDirection), 0) AS voteScore,
                            SUM(IF(v.voteDirection = 1, 1, 0)) AS numUpvotes,
                            SUM(IF(v.voteDirection = -1, 1, 0)) AS numDownvotes
                            
                        FROM posts p
                            JOIN users u ON p.userId = u.id
                            JOIN subreddits s ON p.subredditId = s.id
                            LEFT JOIN votes v ON p.id = v.postId
                        WHERE 
                            s.name = ?
                        GROUP BY p.id
                        ORDER BY (COALESCE(SUM(v.voteDirection),0)/ (NOW() - p.createdAt)) DESC
                        LIMIT 25`, [parameter.name]);
                }
            }
        })
        .then(function(posts) {
            console.log("I am transforming the post: " + posts);
            return posts.map(transformPost);
        });
    }
        

    // Similar to previous function, but retrieves one post by its ID
    getSinglePost(postId) {
        return this.conn.query(
            `
            SELECT
                p.id AS posts_id,
                p.title AS posts_title,
                p.url AS posts_url,
                p.createdAt AS posts_createdAt,
                p.updatedAt AS posts_updatedAt, 
                
                u.id AS users_id,
                u.username AS users_username,
                u.createdAt AS users_createdAt,
                u.updatedAt AS users_updatedAt,
                
                s.id AS subreddits_id,
                s.name AS subreddits_name,
                s.description AS subreddits_description,
                s.createdAt AS subreddits_createdAt,
                s.updatedAt AS subreddits_updatedAt,
                
                COALESCE(SUM(v.voteDirection), 0) AS voteScore,
                SUM(IF(v.voteDirection = 1, 1, 0)) AS numUpvotes,
                SUM(IF(v.voteDirection = -1, 1, 0)) AS numDownvotes
                
            FROM posts p
                JOIN users u ON p.userId = u.id
                JOIN subreddits s ON p.subredditId = s.id
                LEFT JOIN votes v ON p.id = v.postId
                
            WHERE p.id = ?`,
            [postId]
        )
        .then(function(posts) {
            if (posts.length === 0) {
                return null;
            }
            else {
                return transformPost(posts[0]);
            }
        });
    }

    /*
    subreddit should have name and optional description
     */
    createSubreddit(subreddit) {
        return this.conn.query(
            `INSERT INTO subreddits (name, description, createdAt, updatedAt)
            VALUES(?, ?, NOW(), NOW())`, [subreddit.name, subreddit.description])
        .then(function(result) {
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

    getAllSubreddits() {
        return this.conn.query(`
            SELECT id, name, description, createdAt, updatedAt
            FROM subreddits ORDER BY createdAt DESC`
        );
    }

    /*
    vote must have postId, userId, voteDirection
     */
    createVote(vote) {
        if (vote.voteDirection !== 1 && vote.voteDirection !== -1 && vote.voteDirection !== 0) {
            return Promise.reject(new Error("voteDirection must be one of -1, 0, 1"));
        }

        return this.conn.query(`
            INSERT INTO votes (postId, userId, voteDirection, createdAt, updatedAt)
            VALUES (?, ?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE voteDirection = ?, updatedAt = NOW()`, 
            [vote.postId, vote.userId, vote.voteDirection, vote.voteDirection]
        );

    }

    /*
    comment must have userId, postId, text
     */
    createComment(comment) {
        return this.conn.query(`
            INSERT INTO comments (userId, postId, text, createdAt, updatedAt)
            VALUES (?, ?, ?, NOW(), NOW())`,
            [comment.userId, comment.postId, comment.text]
        )
        .then(result => {
            return result.insertId;
        });
    }

    getCommentsForPost(postId) {
        return this.conn.query(`
            SELECT
                c.id as comments_id,
                c.text as comments_text,
                c.createdAt as comments_createdAt,
                c.updatedAt as comments_updatedAt,
                
                u.id as users_id,
                u.username as users_username
                
            FROM comments c
                JOIN users u ON c.userId = u.id
                
            WHERE c.postId = ?
            ORDER BY c.createdAt DESC
            LIMIT 25`,
            [postId]
        )
        .then(function(results) {
            return results.map(function(result) {
                return {
                    id: result.comments_id,
                    text: result.comments_text,
                    createdAt: result.comments_createdAt,
                    updatedAt: result.comments_updatedAt,

                    user: {
                        id: result.users_id,
                        username: result.users_username
                    }
                };
            });
        });
    }

    checkUserLogin(username, password) {
        //return Promise.reject(new Error("TODO: You have to implement the RedditAPI.checkUserLogin function."))
        
        return this.conn.query(`SELECT COUNT(*) AS userExists, username, password FROM users WHERE username = ?`, [username])
            .then(results => {
                //console.log(results[0].userExists);
                //NTS: remember MySQL returns everything in a array, 
                //hence we do results[0].property instead of results.property
                if (results[0].userExists != 1)
                {
                    throw new Error("Username Does Not Exists");
                }
                //Use the bcrypt.compare function to check if the database's hashed password matches the input password
                return bcrypt.compare(password, results[0].password);
            })
            .then(result => {
               if (!result)
               {
                   throw new Error("Wrong Password Entered");
               }
               return this.conn.query(`SELECT id, username, createdAt, updatedAt FROM users WHERE username = ?`, [username]); 
            })
            .then(result => {
                //console.log(result); result is an Array(this.conn.query returns the db rows in an array)
                                        //of user objects, I dont need an Array
                //console.log(result[0]); I just want the object without the array
                //make your promise return the full user OBJECT minus the hashed password
                return result[0];
            });
    }

    createUserSession(userId) {
        var sessionId;
        //return Promise.reject(new Error("TODO: You have to implement the RedditAPI.createUserSession function."))
        //Use bcrypt's genSalt function to create a random string that we'll use as session id (promise)
        return bcrypt.genSalt(HASH_ROUNDS)
        .then(_sessionId => {
            sessionId = _sessionId;
            //Use an INSERT statement to add the new session to the sessions table, using the input userId
            return this.conn.query(`INSERT INTO sessions (userId,token) VALUES (?,?)`,[userId, sessionId]);
         })
        .then(() => {//() instead of result since I dont really need the result
            return sessionId;
        })
        .catch(error => {
            throw new Error("Failed to create Session ID");
        });
    }

    getUserFromSession(sessionId) {
        //return Promise.reject(new Error("TODO: You have to implement the RedditAPI.getUserFromSession function."));
        return this.conn.query(`
            SELECT u.id AS id, u.username AS username, u.createdAt AS createdAt, u.updatedAt AS updatedAt 
            FROM users u join sessions s 
                ON u.id = s.userId 
                WHERE s.token = ?`, [sessionId])
        .then(result => {
            console.log(result);
            return result[0];
        });
    }
    
    //for log out
    deleteSessionFromToken(sessionId){
        return this.conn.query(`
            DELETE FROM sessions WHERE token = ?`, [sessionId]);
    }
    
    getSubredditByName(subRedditName){
        return this.conn.query(`
            SELECT id, name, description, createdAt, updatedAt FROM subreddits WHERE name = ?`, [subRedditName])
        .then(result => {
            if (result.length === 0){
                return null;
            }
            console.log("getSubredditByName worked" + result[0]);
            return result[0]; 
            //should I do a this here?
            //return this.getAllPosts(subRedditName); 
        })
        .catch(error=>{
            console.log("Error in getSubredditByName");
        });
    }
}

module.exports = RedditAPI;