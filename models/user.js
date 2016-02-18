var bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define("User", {
        userName: {
            type: DataTypes.STRING,
            unique: true
        },
        hashedPW: {
            type: DataTypes.STRING
        },
        password: {
            // doesn't store password to db but checks them before doing something.
            type: DataTypes.VIRTUAL,
            // doesn't allow empty password
            allowNull: false,
            // password must have minimum 6 characters to 25 characters.
            validate: {
                len: [6, 25]
            },
            set: function(value) {
                console.log(this);
                var hashedPassword = bcrypt.hashSync(value, 10);
                //this refer to the whole model of user.
                this.setDataValue("hashedPW", hashedPassword);
                // the input password gets passed to the user model then we set the property password to the inputted password.
                this.setDataValue("password", value);
            }
        }
    }, {
        classMethods: {
                authentication: function(data) {
                    return new Promise(function(resolved, rejected) {
                        user.findOne({
                            where: {
                                userName: data.username
                            }
                        }).then(function(user) {
                            if (!user || !bcrypt.compareSync(data.password, user.get("hashedPW"))) {
                                return rejected("Unauthorised!");
                            } else {
                                return resolved(user);
                            }
                        });
                    });
                }
            }
    });
    
    return user;
};

