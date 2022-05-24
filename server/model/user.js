const Sequelize = require('sequelize');

const define = (sequelize) => {
    return sequelize.define('user', {
        // Model attributes are defined here

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        username: {
            type: Sequelize.STRING,
        },

        displayName: {
            field: 'display_name',
            type: Sequelize.STRING,
        },

        cardNumber: {
            field: 'card_number',
            type: Sequelize.STRING,
        },

        active: {
            type: Sequelize.BOOLEAN,
        }

    }, {
        // Other model options go here
        freezeTableName: true,
        tableName: 'user',
        timestamps: false,
        defaultScope: {
            attributes: { exclude: ['cardNumber'] },
        },
    });
};

module.exports = {
    define
};