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
        
      //  console.log("Post OBJ when called: ",post)
        
        // var postInfo = {
        //     userId:post.userId,
        //     title:post.title,
        //     url:post.url,
        //     subredditId:post.subredditId
        // }
        
        
        
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
            
            
            
            // return this.conn.query(
            // `
            //     SELECT * FROM posts JOIN users ON posts.userId = users.id WHERE id = ?`,[result.insertId])
                
            //     .then(info => {
            //         var uObj = 
            // {   id:info.id,
            //     userId:info.userId,
            //     title:info.title,
            //     url:info.url,
            //     subredditId:info.subredditId,
            //     postId:result.insertId,
                
            // }
                    
            //     })
            
            
            
          //  console.log("INSIDE CREATE POST coming back from db: ", JSON.stringify(result))
            // var uObj = 
            // { 
            //     userId:postInfo.userId,
            //     title:postInfo.title,
            //     url:postInfo.url,
            //     subredditId:postInfo.subredditId,
            //     postId:result.insertId
            // }
            
            // return uObj;
        });
    }

  // getAllPosts(subredditId = null) {
        getAllPosts(subredditId) {
        /*
         strings delimited with ` are an ES2015 feature called "template strings".
         they are more powerful than what we are using them for here. one feature of
         template strings is that you can write them on multiple lines. if you try to
         skip a line in a single- or double-quoted string, you would get a syntax error.

         therefore template strings make it very easy to write SQL queries that span multiple
         lines without having to manually split the string line by line.
         */
         
       //  console.log("Last subreddit console log: ",subredditId)
         var resultQuery;
        
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
                
                
            var string2 = `
            GROUP BY p.id
            ORDER BY p.createdAt DESC
            LIMIT 50`;
            
            var stringTop = `
            GROUP BY p.id
            ORDER BY voteScore DESC
            LIMIT 50`;
            
            var stringHot = `
            GROUP BY p.id
            ORDER BY (COALESCE(SUM(v.voteDirection), 0)/(NOW() - p.createdAt)) DESC
            LIMIT 50`;
        
        if (subredditId == undefined){
            
            resultQuery = string1 + string2;
       //     console.log("the last query string ", resultQuery) 
             return this.conn.query(resultQuery)
            
            .then(function(posts){
          //     console.log(posts) //good
                return posts.map(transformPost)
            });
        }
        
        else if (subredditId.type == 'hot'){
            
            resultQuery = string1 + stringHot;
       //     console.log("the last query string ", resultQuery) 
            return this.conn.query(
             resultQuery)
            
            .then(function(posts){
       //     console.log(posts) //good
                return posts.map(transformPost)
            });
        }
          else if (subredditId.type == 'top'){
            
            resultQuery = string1 + stringTop;
       //     console.log("the last query string ", resultQuery) 
         return this.conn.query(
             resultQuery)
            
            .then(function(posts){
      //         console.log(posts) //good
                return posts.map(transformPost)
            });
        }
        
        
        else if(subredditId !== null){

            resultQuery = string1 + ` WHERE p.subredditId = ${subredditId} ` + string2;
      //      console.log("the last query string ", resultQuery) 
         return this.conn.query(
             resultQuery)
            
            .then(function(posts){
        //       console.log(posts) //good
                return posts.map(transformPost)
            });
            
        }
        
        else {
            
            resultQuery = string1 + string2;
       //     console.log("the last query string ", resultQuery) 
             return this.conn.query(resultQuery)
            
            .then(function(posts){
          //     console.log(posts) //good
                return posts.map(transformPost)
            });
        }
    //   console.log("the last query string ", resultQuery) 
    //      return this.conn.query(
    //          resultQuery)
            
    //         .then(function(posts){
    //           console.log(posts) //good
    //             return posts.map(transformPost)
    //         });
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
        
        console.log("Inside Create Vote: ",vote)

        return this.conn.query(`
            INSERT INTO votes (postId, userId, voteDirection,updatedAt,createdAt)
            VALUES (?, ?, ?,NOW(),NOW())
            ON DUPLICATE KEY UPDATE voteDirection = ?`,
            [vote.postId, vote.userId, vote.voteDirection, vote.voteDirection]
        ).then(result => {
            return result.insertId;
        }).catch(error => {
            if (error.code === 'ERROR 1452 (23000)') {
                throw new Error('Voting Catch');
            }
            else {
                throw error;
            }
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
//console.log(username,password);
    //this is accessible throughout the checkUserLogin function, whole scope
    var userObj = {};
  
        //start the promise chain
        return this.conn.query( `SELECT * FROM users WHERE users.username = ?`, [username])
        .then(data => {
        //this callback is for error checking and updating the userObj
        //  console.log(data)
          
            //error checking
            if (data.length === 0){
                return Promise.reject(new Error("Username or password invalid"))
            } //ends if
            else
            {
                //updating userObj
                userObj = {
                    id: data[0].id,
                    username: data[0].username,
                    createdAt: data[0].createdAt,
                    updatedAt: data[0].updatedAt
                }
                //just pass along the data, unchanged
                return data;
             
            } //ends else
        })
        .then(data => bcrypt.compare(password, data[0].password))
        .then(data2 =>{
            //error checking if data2 is true else return userObj
            //console.log("userObj", JSON.stringify(userObj, null, 4))      
            return userObj;
        })
}                                      
   // return Promise.reject(new Error("TODO: You have to implement the RedditAPI.checkUserLogin function."))
        /*
        Here are the steps you should follow:
            1. Find an entry in the users table corresponding to the input username
                a. If no user is found, make your promise throw an error "username or password incorrect".
                b. If you found a user, move to step 2
            2. Use the bcrypt.compare function to check if the database's hashed password matches the input password
                a. if it does, make your promise return the full user object minus the hashed password
                b. if it doesn't, make your promise throw an error "username or password incorrect"
         */
         
createUserSession(userId) {
       // return Promise.reject(new Error("TODO: You have to implement the RedditAPI.createUserSession function."))
        var resToken = "";
        return bcrypt.genSalt(10)
        .then(data2 =>{
          var token = data2;
          //console.log("The Token:", token," the user id:", userId.id)
        resToken = token;
        return token;

        })
        .then(token => this.conn.query(`INSERT INTO sessions (userId,token) VALUES (?,?)`,[userId.id,token]))
        .then(result => {
         //   console.log("query result", result)
         //   console.log(resToken, "the result token")
            return resToken;
        })
}
          
        /*
         Here are the steps you should follow:

         1. Use bcrypt's genSalt function to create a random string that we'll use as session id (promise)
         2. Use an INSERT statement to add the new session to the sessions table, using the input userId
         3. Once the insert is successful, return the random session id generated in step 1
         */
    // }

    getUserFromSession(sessionId) {
       // return Promise.reject(new Error("TODO: You have to implement the RedditAPI.getUserFromSession function."));
        
        return this.conn.query( `
        SELECT users.id,users.username,users.createdAt,users.updatedAt FROM users JOIN sessions ON users.id = sessions.userId WHERE sessions.token = ?`,[sessionId])
        .then(data => {
          //  console.log("USER OBJ",data[0])
            return data[0];
      //      var userO = {
//                     id: data[0].id,
//                     username: data[0].username,
//                     createdAt: data[0].createdAt,
//                     updatedAt: data[0].updatedAt
//                 }
// console.log(JSON.stringify(userO, null, 4))
            //    return userO;
            })
            
            
}

getSubredditByName(name) {
       
      // console.log("Going into getsubreddit by name: should be just a name ", name)
        return this.conn.query(
            `SELECT id, name, description, createdAt, updatedAt FROM subreddits WHERE name = ?`,[name]).then( data => {
                
           //      console.log("Going Out of getsubreddit by name: ", data[0])
                return data[0]} )
        
    }


}

module.exports = RedditAPI;