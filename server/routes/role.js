const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');

const { Op } = require('sequelize');

const common = require('../controller/commonController');
const user = require('../controller/userController');
const role = require('../controller/roleController');

const router = new Router();

router.get('/',
    bodyParser(),
    common.handleSort( {'role': 'role.abbreviation'}, [['description', 'asc']] ),
    common.handleFilter([
        {field: 'description', op: Op.like, val: v => `${v}%`},
        {field: 'abbreviation', op: Op.like, val: v => `${v}%`},
        {field: 'keyGroup', op: Op.like, val: v => `${v}%`, as: 'keyGroup.abbreviation'},
    ]),
    role.listRole,
);

router.delete('/:roleId',
    passport.authenticate('jwt', {session: false}),
    user.isUserAdmin,
    bodyParser(),
    role.findRole,
    role.deleteRole,
);

router.post('/',
    passport.authenticate('jwt', {session: false}),
    user.isUserAdmin,
    bodyParser(),
    role.createRole,
    role.findRole, // to fetch new model
);

router.put('/:roleId',
    passport.authenticate('jwt', {session: false}),
    user.isUserAdmin,
    bodyParser(),
    role.findRole,
    role.editRole,
    role.findRole, // to fetch new model
);

module.exports = router;