const Sequelize = require('sequelize');
const { get } = require('../routes/key');

const define = (sequelize) => {
    return sequelize.define('key', {
        // Model attributes are defined here

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        description: {
            type: Sequelize.STRING,
        },

        keyTagNumber: {
            field: 'key_tag_number',
            type: Sequelize.STRING,
        },

        keyGroupId: {
            field: 'key_group_id',
            type: Sequelize.INTEGER,
        },
        
        cellNumber: {
            field: 'cell_number',
            type: Sequelize.INTEGER,
        },

        // latestLog: {
        //     type: Sequelize.VIRTUAL,
        //     async get() {
        //         let log = await this.getLog({
        //             limit: 1,
        //             order: [ ['createdAt', 'DESC'] ],
        //         });
        //         return log[0];
        //     },
        // },

        // isReturned: {
        //     type: Sequelize.VIRTUAL,
        //     async get() {
        //         let log = await this.latestLog;
        //         return log.action === 'return';
        //     },
        // },

        // isRetrieved: {
        //     type: Sequelize.VIRTUAL,
        //     async get() {
        //         let isReturned = await this.isReturned;
        //         return !isReturned;
        //     },
        // },

    }, {
        // Other model options go here
        freezeTableName: true,
        tableName: 'key',
        timestamps: false,
        defaultScope: {
            attributes: { exclude: ['keyTagNumber'] }
        },
    });
};

module.exports = {
    define
};