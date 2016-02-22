var Sequelize = require('sequelize');

var db = new Sequelize('reddit_clone', 'nicjo', '', {
  dialect: 'mysql'
  });

var bcrypt = require('bcrypt');



var User = db.define('user', {
    email: Sequelize.STRING,
    username: {type: Sequelize.STRING, unique: true},
    hashed_password: Sequelize.STRING,
    password: {  // TODO: make the passwords more secure!
        type: Sequelize.VIRTUAL,
        set: function(actualPassword) {
            this.setDataValue('hashed_password', bcrypt.hashSync(actualPassword, 10));
        }
    }
});

// Even though the content belongs to users, we will setup the userId relationship later
var Content = db.define('content', {
    url: Sequelize.STRING,
    title: Sequelize.STRING
});

// Even though a vote has a link to user and content, we will setup the relationship later
var Vote = db.define('vote', {
    upVote: Sequelize.BOOLEAN
});

var Session = db.define('session', {
    token: Sequelize.STRING
});

User.hasMany(Session); // This will let us do user.createSession
Session.belongsTo(User); // This will let us do Session.findOne({include: User})


// User <-> Content relationship
Content.belongsTo(User); // This will add a `setUser` function on content objects
User.hasMany(Content); // This will add an `addContent` function on user objects

// User <-> Vote <-> Content relationship
User.belongsToMany(Content, {through: Vote, as: 'Upvotes'}); // This will add an `add`
Content.belongsToMany(User, {through: Vote});

Content.hasMany(Vote); //needed to add the contentId in Vote


db.sync().then(function() {
  console.log('Success!')
}).catch(function(error) {
  console.log(error)
}); // Only needs to be used once!



var createNewUser = function (email, username, password, callback){
    
    return User.create({
        email: email,
        username: username,
        password: password
    }).then(function(user){
        if (typeof callback === 'function') {
            callback(user);
        }
    });
}

// createNewUser('dude@thedude.net', 'theDude', 'theDudePassword', function(newdude){console.log(JSON.stringify(newdude, 0 , 2))});




// This function will create a new Content item that is immediately associated with the user object passed to it. 
// Once the content is created, your function will call the callback with that content.
var createNewContent = function (url, title, userId, callback){
    
    User.findById(userId);
    
    return Content.create({
        url: url,
        title: title,
        userId: userId
      
    }).then(function(cont){
        if (typeof callback === 'function') {
            callback(cont);
        }
    });
}

// createNewContent("http://i.imgur.com/QO4UFYO.jpg", "The computers at my vet are suspended with eyebolts and leashes so they don't get pee'd on.", 1, function(newCont){console.log(JSON.stringify(newCont, 0 , 2))});







