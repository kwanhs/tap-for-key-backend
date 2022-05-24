const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');

const { Op } = require('sequelize');

const common = require('../controller/commonController');
const user = require('../controller/userController');
const keyGroup = require('../controller/keyGroupController');

const router = new Router();

router.get('/',
    bodyParser(),
    common.handleSort( {'key': 'key.description'}, [['description', 'asc']] ),
    common.handleFilter([
        {field: 'description', op: Op.like, val: v => `${v}%`},
        {field: 'abbreviation', op: Op.like, val: v => `${v}%`},
        {field: 'key', op: Op.like, val: v => `${v}%`, as: 'key.description'},
    ]),
    keyGroup.listKeyGroup,
);

router.delete('/:keyGroupId',
    passport.authenticate('jwt', {session: false}),
    user.isUserAdmin,
    bodyParser(),
    keyGroup.findKeyGroup,
    keyGroup.deletekeyGroup,
);

router.post('/',
    passport.authenticate('jwt', {session: false}),
    user.isUserAdmin,
    bodyParser(),
    keyGroup.createKeyGroup,
    keyGroup.findKeyGroup, // to fetch new model
);

router.put('/:keyGroupId',
    passport.authenticate('jwt', {session: false}),
    user.isUserAdmin,
    bodyParser(),
    keyGroup.findKeyGroup,
    keyGroup.editKeyGroup,
    keyGroup.findKeyGroup, // to fetch new model
);

module.exports = router;
