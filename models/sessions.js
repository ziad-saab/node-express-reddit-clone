module.exports = function(sequelize, DataTypes) {
    var Session = sequelize.define("sessions", {
        token: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Session.belongsTo(models.users);
            }
        }
    });

    return Session;
};