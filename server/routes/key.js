const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');

const { Op } = require('sequelize');

const common = require('../controller/commonController');
const key = require('../controller/keyController');
const user = require('../controller/userController');
const cabin = require('../controller/cabinController');
const log = require('../controller/logController')

const router = new Router();

router.get('/',
    bodyParser(),
    common.handleSort( {'keyGroup': 'keyGroup.abbreviation'}, [['id', 'asc']] ),
    common.handleFilter([
        {field: 'cellNumber', op: Op.eq, val: v => v},
        {field: 'description', op: Op.like, val: v => `${v}%`},
        {field: 'keyGroup', op: Op.like, val: v => `${v}%`, as: 'keyGroup.abbreviation'},
    ]),
    key.listKey
);

router.get('/get/:keyId',
    bodyParser(),
    key.findKey,
    key.getKey
);

router.get('/get/:keyId/log',
    bodyParser(),
    common.handleSort({}, [['createdAt', 'desc']] ),
    common.handlePaginate(15, 0),
    key.findKey,
    log.listLog
);

router.get('/return',
    bodyParser(),
    cabin.update,
    cabin.allCellsClosed,
    user.findUser,
    user.isUserActive,
    key.findKey,
    key.isKeyRetrieved,
    log.logReturn,
    cabin.openCellForKey,
);

router.get('/force-return',
    bodyParser(),
    cabin.update,
    cabin.allCellsClosed,
    user.findUser,
    user.isUserActive,
    key.findKey,
    key.isKeyRetrieved,
    log.logReturn,
);

router.get('/retrieve',
    bodyParser(),
    cabin.update,
    cabin.allCellsClosed,
    user.findUser,
    user.isUserActive,
    key.findKey,
    key.isKeyAccessible,
    key.isKeyReturned,
    log.logRetrieve,
    cabin.openCellForKey,
);

router.post('/',
    passport.authenticate('jwt', {session: false}),
    user.isUserAdmin,
    bodyParser(),
    key.createKey,
    key.findKey, // to fetch new model
);

router.put('/:keyId',
    passport.authenticate('jwt', {session: false}),
    user.isUserAdmin,
    bodyParser(),
    key.findKey,
    key.editKey,
    key.findKey, // to fetch new model
);

module.exports = router;
