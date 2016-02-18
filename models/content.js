module.exports = function(sequelize, DataTypes) {
    var content = sequelize.define("Content", {
        url: {
            type: DataTypes.STRING,
            validate: {
                len: [1, 500]
            }
        },
        title: {
            type: DataTypes.STRING,
            validate: {
                len: [5, 30]
            }
        },
    });
    return content;
};