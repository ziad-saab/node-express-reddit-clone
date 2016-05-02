module.exports = function(sequelize, DataTypes) {
    var session = sequelize.define("Session", {
        token: {
            type: DataTypes.STRING
        }
    });
    return session;
};