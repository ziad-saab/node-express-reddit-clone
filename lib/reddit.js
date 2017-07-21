"use strict";

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

    getAllPosts(subredditId) {
        /*
         strings delimited with ` are an ES2015 feature called "template strings".
         they are more powerful than what we are using them for here. one feature of
         template strings is that you can write them on multiple lines. if you try to
         skip a line in a single- or double-quoted string, you would get a syntax error.

         therefore template strings make it very easy to write SQL queries that span multiple
         lines without having to manually split the string line by line.
         */
         var subreddit_string = '';
         if (subredditId){
           subreddit_string += '\n WHERE p.subredditId = 15 \n';
         }

         var query1 = `SELECT
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

        var query2 = `GROUP BY p.id
                      ORDER BY p.createdAt DESC
                      LIMIT 25;`

        return this.conn.query(query1 + subreddit_string + query2) // HERE
        .then(function(posts) {
          console.log(posts);
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
    getSubredditByName(name){ // self introduced API
      return this.conn.query(`
          SELECT
              subreddits.id as subreddit_id
          FROM subreddits
          WHERE subreddits.name = ?;
          `,
          [name]
      ).then(subreddit => {return subreddit[0]});
    }
    checkUserLogin(username, password) {
      // if(username.length !=7){
      //     return Promise.reject(new Error('not 7'));
      // }
        var user = {};
        var er = "username or password incorrect";
        return this.conn.query(`
            SELECT
                users.id as id,
                users.username as username,
                users.password as password

            FROM users

            WHERE users.username = ?`,
            [username]
        )
          .then(myTable => {
            if (myTable.length == 0) {
              throw new Error('404');
            } else {
              user = myTable[0];
              return user;
            }
          })
          .then(u => bcrypt.compare(password, u.password))
          .then(correct => {
            if(correct){
              return {id:user.id,username:user.username}
            }
            else{
              throw new Error(er);
              //return Promise.reject(new Error("voteDirection must be one of -1, 0, 1"));
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


        // return Promise.reject(new Error("TODO: You have to implement the RedditAPI.createUserSession function."))

        var the_token;

        return bcrypt.genSalt(10).then(token => {
          the_token = token;
          return token;
        }).then(token => {
          this.conn.query(`
              INSERT INTO sessions (userId, token) VALUES (?,?)`
              ,
              [userId, token]);
          return the_token;
        });
        /*
         Here are the steps you should follow:

         1. Use bcrypt's genSalt function to create a random string that we'll use as session id (promise)
         2. Use an INSERT statement to add the new session to the sessions table, using the input userId
         3. Once the insert is successful, return the random session id generated in step 1
         */
    }

    // createUserSession(userId) {
    //   // return Promise.reject(new Error("TODO: You have to implement the RedditAPI.createUserSession function."))
    //    var resToken = "";
    //    return bcrypt.genSalt(10)
    //    .then(data2 =>{
    //      var token = data2;
    //      //console.log("The Token:", token," the user id:", userId.id)
    //    resToken = token;
    //    return token;
    //
    //    })
    //    .then(token => this.conn.query(`INSERT INTO sessions (userId,token) VALUES (?,?)`,[userId.id,token]))
    //    .then(result => {
    //        console.log("query result", result)
    //        console.log(resToken, "the result token")
    //        return resToken;
    //    })
    //  }

    getUserFromSession(sessionId) {
      return this.conn.query(`
           SELECT
           u.id AS id,
           u.username AS username,
           u.createdAt AS createdAt,
           u.updatedAt AS updatedAt
           FROM users u join sessions s
               ON u.id = s.userId
               WHERE s.token = ?`, [sessionId])
       .then(result => {
           return result[0];
       });
    }
}

module.exports = RedditAPI;
