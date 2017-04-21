"use strict";

var bcrypt = require('bcrypt-as-promised');
var api_key = 'key-060e7a90a54f5781a70082bc71248b53';
var domain = 'sandboxf396386838d0457dab2419de51681f3b.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var HASH_ROUNDS = 10;

// This is a helper function to map a flat post to nested post
function transformPost(post) {
    return {
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
    };
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
            if(user.email){
                return this.conn.query('INSERT INTO users (username, email, password, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())', [user.username, user.email, hashedPassword]);
            } else {
                return this.conn.query('INSERT INTO users (username, password, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())', [user.username, hashedPassword]);
            }
        })
        .then(result => {
            return result.insertId;
        })
        .catch(error => {
            // Special error handling for duplicate entry
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('A user with this username or email already exists');
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
            return result.insertId;
        });
    }


    getAllPosts(args) {
// To do this, you'll first have to make some changes to the RedditAPI.getAllPosts function. 
// Make it accept an optional sortingMethod parameter that can be hot or top. If the sorting method 
// is set to top, then the posts should be ordered by voteScore DESC. If the sorting method is set to hot, 
// then the posts should be ordered by voteScore / NOW() - p.createdAt DESC. 
// This formula will take the score, but divide it by the number of seconds the post has been online. 
// This will make newer posts appear higher if they have the same number of votes as an older post.
        var substitutions = [];
        var orderBySQL = 'p.createdAt DESC';
        
        if (args.sortingMethod === 'top') {
        
            orderBySQL = 'voteScore DESC'
        }
        if (args.sortingMethod === 'hot') {
            console.log('im hurr')
            orderBySQL = 'hotScore DESC'
        }
        var subredditIdSQL = '';
        if (args.subredditId) {
            
            subredditIdSQL = 'WHERE p.subredditId = ?'
            substitutions.push(args.subredditId);
        }
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
                COALESCE(SUM(v.voteDirection), 0) / (NOW() - p.createdAt) AS hotScore, 
                SUM(IF(v.voteDirection = 1, 1, 0)) AS numUpvotes,
                SUM(IF(v.voteDirection = -1, 1, 0)) AS numDownvotes
                
            FROM posts p
                JOIN users u ON p.userId = u.id
                JOIN subreddits s ON p.subredditId = s.id
                LEFT JOIN votes v ON p.id = v.postId
                
            ${subredditIdSQL}
            GROUP BY p.id
            ORDER BY ${orderBySQL}
            LIMIT 25
            `, substitutions
            )
            .then(function(posts) {
                return posts.map(transformPost)
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

// First, we have to go from subreddit name to subreddit ID. Create a RedditAPI function called getSubredditByName(name). 
// This should make a query to the database, and return a subreddit object that matches the given name. If no subreddit was found, 
// the promise should resolve with null.
    getSubredditByName(name) {
        return this.conn.query(`SELECT * FROM subreddits WHERE name = ?`, [name])
        .then(result => {
            if (result[0]) {
                return result[0];
            } else {
                return null;
            }
        })

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
            ON DUPLICATE KEY 
            UPDATE 
                voteDirection = ?,
                updatedAt = NOW()
            `,
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
        /*
        Here are the steps you should follow:
            1. Find an entry in the users table corresponding to the input username
                a. If no user is found, make your promise throw an error "username or password incorrect".
                b. If you found a user, move to step 2
            2. Use the bcrypt.compare function to check if the database's hashed password matches the input password
                a. if it does, make your promise return the full user object minus the hashed password
                b. if it doesn't, make your promise throw an error "username or password incorrect"
         */
        
  return this.conn.query(`SELECT * FROM users WHERE users.username = ?`, [username])
        .then(result => {
            if (!result[0]){
                throw new Error("username invalid");
            } else {
                return bcrypt.compare(password, result[0].password)
                .then(passwordCheck => {
                    if (passwordCheck) { //this if is unnecessary because bcrypt.compare won't come here if false; it throws an error which is caught below
                        
                        console.log({
                            username: result[0].username,
                            id: result[0].id,
                            createdAt: result[0].createdAt,
                            updatedAt: result[0].updatedAt
                        });
                        return {
                            username: result[0].username,
                            id: result[0].id,
                            createdAt: result[0].createdAt,
                            updatedAt: result[0].updatedAt
                        };
                        
                    }
                })
                .catch(result => {throw new Error("password invalid");})
            }
        })
    }

    createUserSession(userId) {
        /*
         Here are the steps you should follow:
         1. Use bcrypt's genSalt function to create a random string that we'll use as session id (promise)
         2. Use an INSERT statement to add the new session to the sessions table, using the input userId
         3. Once the insert is successful, return the random session id generated in step 1
         */
         return bcrypt.genSalt(userId)
         .then(sessionToken => {
             return this.conn.query(`INSERT INTO sessions (userId, token) Values (?, ?)`, [userId, sessionToken])
             .then(result => {

                  return sessionToken;
             })
         })
    }

    getUserFromSession(sessionId) {
        return (this.conn.query(`SELECT users.id, users.username, users.password, users.createdAt, users.updatedAt 
                                FROM users JOIN sessions ON users.id = sessions.userId 
                                WHERE sessions.token =?`, [sessionId]))
        .then(user => {
            console.log(user);
            return user[0];
        })
    }
    
    createPasswordResetToken(email){
        //In this method, generate a random string 
        //and insert it along with the user ID in the passwordResetTokens table.
        var userId;
        return this.conn.query(`SELECT * FROM users WHERE email = ? `, [email])
        .then(result => {
            if (result[0]){
                userId = result[0].id;
                return bcrypt.hash(Math.random().toString(), HASH_ROUNDS)
            } else {
                Promise.reject(new Error("That email isn't in our database"))
            }
        })
        .then(token => {
            this.conn.query(`INSERT INTO passwordResetTokens (userId, token) Values (?, ?)`, [parseInt(userId), token])
            return token;
        })
        .then(token => {
            var data = {
              from: 'Excited User <me@samples.mailgun.org>',
              to: email,
              subject: 'Reset Your Reddit Clone Password',
              text: 'click here -> https://decode-mtl-plllmg.c9users.io/auth/resetPassword?token='.concat(token)
            };
             
            mailgun.messages().send(data, function (error, body) {
              console.log(body);
            });
        })
    }
    
    resetPassword(token, newPassword){
        var userId
        var authenticated = true;
        return this.conn.query(`SELECT * FROM passwordResetTokens WHERE token = ? `, [token])
        .then(result => {
            if (!result[0]){
                authenticated = false;
            }
            if (authenticated){
                userId = result[0].userId;
                return bcrypt.hash(newPassword, HASH_ROUNDS)    
            }
            
        })
        .then(hashedPassword => {
            if (authenticated){
                return this.conn.query(`UPDATE users SET password = ? WHERE id = ?`,[hashedPassword, userId])    
            }
        })
        .then(()=>{
            if (authenticated){
                this.conn.query(`DELETE FROM passwordResetTokens WHERE token = ?`, [token])
                return 'worked';    
            }
        })
    }
}

module.exports = RedditAPI;