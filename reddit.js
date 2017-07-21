'use strict'

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
                return this.conn.query(`INSERT INTO users (username,password, createdAt, updatedAt) 
                VALUES (?, ?, NOW(), NOW())`, [user.username, hashedPassword]);
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

    createPost(post) {
        if (post.subredditId === undefined) {
            throw new Error('SubredditId is missing');
        }
        else {
            return this.conn.query(
                `
                INSERT INTO posts (subredditId, userId, title, url, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, NOW(), NOW())
                `,
                [post.subredditId, post.userId, post.title, post.url]
            )
            .then(result => {
                return result.insertId;
            });
        }
    }
 
// Create Subreddit    
    createSubreddit(subreddit) {
        return this.conn.query(
        `
            INSERT INTO subreddits(name, description, createdAt, updatedAt)
            VALUES (?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE name=?, updatedAt=NOW()`,
            
            [subreddit.name, subreddit.description, subreddit.name]
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
    };

    createVote(vote) {
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
                throw Error('Vote direction should be one of the following values (-1,0,1)');
        }
    };

    getAllPosts() {
        /*
        strings delimited with ` are an ES2015 feature called "template strings".
        they are more powerful than what we are using them for here. one feature of
        template strings is that you can write them on multiple lines. if you try to
        skip a line in a single- or double-quoted string, you would get a syntax error.

        therefore template strings make it very easy to write SQL queries that span multiple
        lines without having to manually split the string line by line.
         */
        return this.conn.query(
                `
            SELECT p.id
            , p.title
            , p.url
            , p.userId
            , p.createdAt
            , p.updatedAt
            , p.subredditId
            , u.username as userName
            , u.createdAt as uCreatedAt
            , u.updatedAt as uUpdatedAt
            , s.name AS subredditName
            , s.description AS subredditDescription
            , s.createdAt AS subredditCreatedAt
            , s.updatedAt AS subredditUpdatedAt
            , SUM(v.voteDirection) AS voteScore
            FROM posts p
            JOIN users u ON u.id = p.userId
            LEFT JOIN subreddits s ON p.subredditId = s.id
            LEFT JOIN votes v ON p.id = v.postId
            GROUP BY 
            p.id
            , p.title
            , p.url
            , p.createdAt
            , p.updatedAt
            , p.subredditId
            , p.userId 
            , s.name
            , s.description
            , s.createdAt
            , s.updatedAt
            ORDER BY SUM(v.voteDirection) DESC
            LIMIT 25`
            )
            .then(result => {
                return result.map(function(post) {
                    return {
                        id: post.id,
                        title: post.title,
                        url: post.url,
                        voteScore: post.voteScore,
                        createdAt: post.createdAt,
                        updatedAt: post.updatedAt,
                        subreddit: {
                            id: post.subredditId,
                            name: post.subredditName,
                            description: post.subredditDescription,
                            createdAt: post.subredditCreatedAt,
                            updatedAt: post.subredditUpdatedAt                          
                        },
                        user: {
                            id: post.userId,
                            name: post.userName,
                            createdAd: post.uCreatedAt,
                            updatedAt: post.uUpdatedAt
                        }
                    }
                });
            });
        }
        
    getAllSubreddits() {
        return this.conn.query (
            `SELECT id
            , name
            , description
            , createdAt
            , updatedAt
            FROM subreddits
            ORDER BY createdAt DESC`
        )
        .then(result => {
            return result.map(function(subreddit) {
                return {
                    id: subreddit.id,
                    name: subreddit.name,
                    description: subreddit.description,
                    createdAt: subreddit.createdAt,
                    updatedAt: subreddit.updatedAt
                }
            })
        })
    }

}

module.exports = RedditAPI;