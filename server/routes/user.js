const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');

const { Op } = require('sequelize');

const common = require('../controller/commonController');
const user = require('../controller/userController');

const router = new Router();

router.get('/',
    passport.authenticate('jwt', {session: false}),
    user.isUserAdmin,
    bodyParser(),
    common.handleSort( {'role': 'role.abbreviation'}, [['username', 'asc']] ),
    common.handleFilter([
        {field: 'username', op: Op.like, val: v => `${v}%`},
        {field: 'displayName', op: Op.like, val: v => `%${v}%`},
        {field: 'role', op: Op.like, val: v => `${v}%`, as: 'role.abbreviation'},
    ]),
    common.handlePaginate(5, 0),
    user.listUser,
);

router.get('/:userId',
    bodyParser(),
    user.findUser,
    user.getAccessibleKeys,
    user.getUser,
);

router.post('/',
    passport.authenticate('jwt', {session: false}),
    user.isUserAdmin,
    bodyParser(),
    user.createUser,
    user.findUser, // to fetch new model
);

router.post('/login',
    bodyParser(),
    user.authenticate,
    user.tokenise,
);

router.put('/:userId',
    passport.authenticate('jwt', {session: false}),
    user.isUserAdmin,
    bodyParser(),
    user.findUser,
    user.editUser,
    user.findUser, // to fetch new model
);

module.exports = router;