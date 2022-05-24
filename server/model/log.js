const Sequelize = require('sequelize');

const define = (sequelize) => {
    return sequelize.define('log', {
        // Model attributes are defined here

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        createdAt: {
            field: 'created_at',
            type: Sequelize.DATE,
        },

        userId: {
            field: 'user_id',
            type: Sequelize.INTEGER,
        },

        keyId: {
            field: 'key_id',
            type: Sequelize.INTEGER,
        },

        action: {
            type: Sequelize.STRING,
        }

    }, {
        // Other model options go here
        freezeTableName: true,
        tableName: 'log',
        timestamps: true,
        updatedAt: false,
    });
};

module.exports = {
    define
};