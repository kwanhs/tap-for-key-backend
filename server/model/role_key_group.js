const Sequelize = require('sequelize');

const define = (sequelize) => {
    return sequelize.define('role_key_xref', {
        // Model attributes are defined here

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },

        roleId: {
            field: 'role_id',
            type: Sequelize.INTEGER,
        },

        keyGroupId: {
            field: 'key_group_id',
            type: Sequelize.INTEGER,
        },

    }, {
        // Other model options go here
        freezeTableName: true,
        tableName: 'role_key_xref',
        timestamps: false,
    });
};

module.exports = {
    define
};