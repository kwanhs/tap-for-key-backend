const sequelize = require('../../config/db');

const Key = require('./key').define(sequelize);
const KeyGroup = require('./key_group').define(sequelize);

const User = require('./user').define(sequelize);
const User_Role = require('./user_role').define(sequelize);
const User_KeyGroup = require('./user_key_group').define(sequelize);

const Role = require('./role').define(sequelize);
const Role_KeyGroup = require('./role_key_group').define(sequelize);

const Log = require('./log').define(sequelize);


// Key - KeyGroup
Key.belongsTo(KeyGroup, {
    foreignKey:'keyGroupId',
    as: 'keyGroup'
});

KeyGroup.hasMany(Key, {
    as: 'key'
});


// User - KeyGroup
User.belongsToMany(KeyGroup, {
    through: User_KeyGroup,
    as: 'keyGroup',
});

KeyGroup.belongsToMany(User, {
    through: User_KeyGroup,
    as: 'user'
});


// User - Role
User.belongsToMany(Role, {
    through: User_Role,
    as: 'role'
});

Role.belongsToMany(User, {
    through: User_Role,
    as: 'user'
});


// Role - KeyGroup
KeyGroup.belongsToMany(Role, {
    through: Role_KeyGroup,
    as: 'role'
});

Role.belongsToMany(KeyGroup, {
    through: Role_KeyGroup,
    as: 'keyGroup'
});


// Log - User
User.hasMany(Log, {as: 'log'});
Log.belongsTo(User, {as: 'user'});


// Log - Key
Key.hasMany(Log, {as: 'log'});
Log.belongsTo(Key, {as: 'key'});


// custom methods
Key.prototype.getLatestLog = async function() {
    let log = await this.getLog({
        limit: 1,
        order: [ ['createdAt', 'DESC'] ],
    });
    return log[0];
},

Key.prototype.isReturned = async function() {
    let log = await this.getLatestLog();
    return !log || log.action === 'return';
},

Key.prototype.isRetrieved = async function() {
    let isReturned = await this.isReturned();
    return !isReturned;
},


module.exports = {
    sequelize,
    Key,
    KeyGroup,
    User,
    Role,
    Log,
}