module.exports = function(sequelize, DataTypes) {
    var Vote = sequelize.define("votes", {
        upVote: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function(models) {
            }
        }
    });

    return Vote;
};