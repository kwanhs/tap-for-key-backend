
const Router = require('koa-router');

const key = require('./key');
const keyGroup = require('./keyGroup');
const user = require('./user');
const role = require('./role');
const tag = require('./tag');

const router = new Router();
const api = new Router();

api.use('/key', key.routes());
api.use('/keyGroup', keyGroup.routes());
api.use('/user', user.routes());
api.use('/role', role.routes());
api.use('/tag', tag.routes());

router.use('/api', api.routes());

module.exports = router;