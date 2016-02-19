module.exports = function(sequelize, DataTypes) {
    var Vote = sequelize.define("votes", {
        upVote: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
            }
        }
    });

    return Vote;
};