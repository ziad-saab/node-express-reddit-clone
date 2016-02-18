module.exports = function(sequelize, DataTypes) {
    var Content = sequelize.define("contents", {
        url: DataTypes.STRING,
        title: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Content.belongsTo(models.users);
                Content.belongsToMany(models.users, {
                   through: models.votes
                });
            }
        }
    });

    return Content;
};