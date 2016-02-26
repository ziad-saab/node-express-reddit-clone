var bcrypt = require('bcrypt')
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("users", {
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            set: function(actualPassword) {
                this.setDataValue('passwordHash', bcrypt.hashSync(actualPassword, 10));
            }
        },
        passwordHash: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.contents);
                User.belongsToMany(models.contents, {
                    through: models.votes,
                    as: 'Upvotes'
                });
                User.hasMany(models.sessions);
            }
        }
    });

    return User;
};

