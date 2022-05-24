const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const tag = require('../controller/tagController');
const user = require('../controller/userController');
const key = require('../controller/keyController');

const router = new Router();

router.get('/:tagId',
    bodyParser(),
    tag.getTag,
    user.findUser,
    user.isUserActive,
    user.getAccessibleKeys,
    user.getUser,
    key.findKey,
);

module.exports = router;