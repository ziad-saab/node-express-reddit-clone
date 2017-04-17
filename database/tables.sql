DROP DATABASE IF EXISTS reddit;

CREATE DATABASE reddit;

USE reddit;

-- This creates the users table. The username field is constrained to unique
-- values only, by using a UNIQUE KEY on that column
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(60) NOT NULL, -- why 60??? ask me :)
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY username (username)
);

CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  token VARCHAR(50),
  UNIQUE KEY token (token),
  FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE subreddits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  description VARCHAR(1000),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY name (name)
);


-- This creates the posts table. The userId column references the id column of
-- users. If a user is deleted, the corresponding posts' userIds will be set NULL.
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(300) DEFAULT NULL,
  url VARCHAR(2000) DEFAULT NULL,
  userId INT,
  subredditId INT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  KEY userId (userId),
  KEY subredditId (subredditId),
  FOREIGN KEY (userId) REFERENCES users (id) ON DELETE SET NULL,
  FOREIGN KEY (subredditId) REFERENCES subreddits (id) ON DELETE CASCADE
);

CREATE TABLE votes (
  userId INT,
  postId INT,
  voteDirection TINYINT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (userId, postId),
  KEY userId (userId),
  KEY postId (postId),
  FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES posts (id) ON DELETE CASCADE
);


CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  postId INT,
  text VARCHAR(10000),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id) ON DELETE SET NULL,
  FOREIGN KEY (postId) REFERENCES posts (id) ON DELETE CASCADE
);