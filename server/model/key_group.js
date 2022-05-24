const Sequelize = require('sequelize');

const define = (sequelize) => {
    return sequelize.define('key_group', {
        // Model attributes are defined here

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        description: {
            type: Sequelize.STRING,
        },

        abbreviation: {
            type: Sequelize.STRING,
        },

    }, {
        // Other model options go here
        freezeTableName: true,
        tableName: 'key_group',
        timestamps: false,
    });
};

module.exports = {
    define
};