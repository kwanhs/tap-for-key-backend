const Cabin = require('../hardware/cabin')
const { DISABLE_CHECK } = require('./argv')

const { channel } = require('../channel.js')

const cabin = new Cabin(channel.length, channel);

module.exports = {
    cabin,
    NO_DOOR_CHECK: DISABLE_CHECK,
};