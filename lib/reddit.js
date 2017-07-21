"use strict";//

var bcrypt = require('bcrypt-as-promised');
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
            return result.insertId;
        });
    }

    getAllPosts(subredditId = null, sortingMethod = null) {
        var sortSetting;
        
        console.log(sortingMethod + " initial sorting call");
        if (sortingMethod === 'hot') {
            sortSetting = ` ORDER BY COALESCE(SUM(v.voteDirection), 0) / (NOW() - p.createdAt) DESC `;
        } else if ( sortingMethod === 'top') {
            sortSetting = ` ORDER BY voteScore DESC `;
        } else {
            sortSetting = ` ORDER BY p.createdAt DESC `;
        }
        
        var resultString;
        var string1 = `
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
                LEFT JOIN votes v ON p.id = v.postId `;
                
        var string2 = ` GROUP BY p.id `;
        var string3 =  ` LIMIT 25; `;
        
        if (subredditId !==  null) {
          resultString = string1 + ` WHERE p.subredditId = ${subredditId} ` + string2 + sortSetting + string3;
        } else {
            resultString = string1 + string2 + sortSetting + string3;
        }
        
        return this.conn.query(
         resultString
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
                console.log('DATA RECEIVED', posts);
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
            
        ).then( result => {
            console.log(result)
            return result
        })
        .catch( error => {
            console.log(error + "You made and error in get all subreddits")
            return error
        });
    }

    /*
    vote must have postId, userId, voteDirection
     */
    createVote(vote) {
        if (vote.voteDirection !== 1 && vote.voteDirection !== -1 && vote.voteDirection !== 0) {
            return Promise.reject(new Error("voteDirection must be one of -1, 0, 1"));
        }

        return this.conn.query(`
            INSERT INTO votes (postId, userId, voteDirection)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE voteDirection = ?`,
            [vote.postId, vote.userId, vote.voteDirection, vote.voteDirection]
        ).then(result => {
            return result.insertId;
        });

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
        
        return this.conn.query(`
        SELECT 
        * 
        FROM users 
        WHERE 
        users.username = ?`, [username]) 
        .then( (result) => { 
            if (result.length === 0) {
                throw new Error ("username or password invalid");
            } 
            else {
                return bcrypt.compare(password, result[0].password).then((results) => {
                    if (results == true) { 
                        var resultNoPassword = {
                            id : result[0].id, 
                            username : result[0].username, 
                            createdAt : result[0].createdAt, 
                            updatedAt : result[0].updatedAt
                        };
                    return resultNoPassword;
                    } 
                }).catch(error => {
                    throw new Error ("username or password invalid");
                })
            }
        })
    } 
                
            
    createUserSession(userId) {
        return bcrypt.genSalt(HASH_ROUNDS).then(sessionId => {
            var sessionToken = sessionId;
            
            return this.conn.query(`
                INSERT INTO sessions(userId, token) VALUES(?, ?)`, 
                [userId, sessionToken]
            )})
            .then(result => {
                return this.conn.query(`
                SELECT id, userId, token
                FROM sessions
                WHERE sessions.userId = ?`, 
                [userId])
            })
            .then(result => {
                return result[0];
        })
      }
                

    getUserFromSession(sessionId) {
        return this.conn.query(`
            SELECT 
            users.id AS id, 
            users.username AS username, 
            sessions.token AS SESSION 
            FROM users 
            JOIN sessions 
            ON (users.id = sessions.userId)
            WHERE
            sessions.token = ?;  
        `, [sessionId]).then((data) => {
            return { 
                     id : data[0].id,
                     username : data[0].username,
                     token : data[0].SESSION
                    } 
        })
        .catch (err => {
            return Promise.reject(new Error("THERE LOOKS TO BE AN ERROR" + err));
        })
        
    }
    
    getSubredditByName(name) {
        return this.conn.query(
                `SELECT 
                    *
                FROM
                    subreddits
                WHERE 
                    name = ?`,[name]
            ).then(data => {
                // console.log(data + "hello")
                if (data.length === 0) {
                    return null;
                }
                return data;
            })
            .catch ( error => {
                return Promise.reject(new Error("THERE LOOKS TO BE AN ERROR" + error));
            })
    
        
    }
    
}

module.exports = RedditAPI;