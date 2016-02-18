module.exports = function(sequelize, DataTypes) {
    var vote = sequelize.define("Vote", {
        upDown: DataTypes.BOOLEAN
    });
    return vote;
}