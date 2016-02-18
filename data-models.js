var Sequelize = require('sequelize');

var db = new Sequelize('reddit_clone', 'aliyahmaliyah', '', {
    dialect: 'mysql'
});

var User = db.define('user', {
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    passwordHash: Sequelize.STRING
});

var Content = db.define('content', {
    url: Sequelize.STRING,
    title: Sequelize.STRING
});

var Vote = db.define('vote', {
    upVote: Sequelize.BOOLEAN
});

// User <-> Content relationship
Content.belongsTo(User); // This will add a `setUser` function on content objects
User.hasMany(Content); // This will add an `addContent` function on user objects

// User <-> Vote <-> Content relationship
User.belongsToMany(Content, {
    through: Vote,
    as: 'Upvotes'
}); // This will add an `add`
Content.belongsToMany(User, {
    through: Vote
});

var Session = db.define('session', {
    token: Sequelize.STRING
});
User.hasMany(Session); // This will let us do user.createSession
Session.belongsTo(User); // This will let us do Session.findOne({include: User})

//db.sync(); // Only needs to be used once!

//Create a new User
function createNewUser(username, password, cb) {
    User.create({username: username, password: password}).then(function(user) { // then is saying "once you've done creating the user, then you're going to run the function on a user which is defined when the first function is called"
       cb(user); 
    });
    
}
//createNewUser('aliyahmaliyah','badpassword', function(results){
//     return results;
// })

//Create new Contents
function createNewContent(userID, url, title, cb){
    User.findById(userID).then(function(user){ // once you've found the userID I want you to create content associated with that user ID
    user.createContent({
        url: url,
        title: title
    }).then(function (content) {
        cb(content)
    })
    });
}
// createNewContent(1, 'www.aliyahmaliyah.com', 'my site!', function(newContent){
//     return newContent;
// })