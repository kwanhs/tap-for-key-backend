const Sequelize = require('sequelize');

const define = (sequelize) => {
    return sequelize.define('user_key_xref', {
        // Model attributes are defined here

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        userId: {
            field: 'user_id',
            type: Sequelize.INTEGER,
        },

        keyGroupId: {
            field: 'key_group_id',
            type: Sequelize.INTEGER,
        },

    }, {
        // Other model options go here
        freezeTableName: true,
        tableName: 'user_key_xref',
        timestamps: false,
    });
};

module.exports = {
    define
};