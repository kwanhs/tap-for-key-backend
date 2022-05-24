const { Key, KeyGroup, User, Role } = require('../model/index');

const jwt = require('jsonwebtoken');
const Error = require('../helper/error');

const { Op } = require('sequelize');

const { jwtSecret, adminUser, adminPwd } = require('../../config/passport')

async function authenticate(ctx, next) {
    let { username, password } = ctx.request.body;

    // let passwordHash = encrpyt.password(password);

    // let user = await User.findOne({
    //     where: {
    //         username,
    //         password: passwordHash,
    //     }
    // });

    // if (!user) throw new Error.Unauthorized();

    if (username !== adminUser || password !== adminPwd)
        throw new Error.Unauthorized();

    ctx.user = {
        username: 'admin',
        role: 'admin',
    };
    
    await next();
}

async function createUser(ctx, next) {
    let { username, displayName, cardNumber, active, role } = ctx.request.body;
    
    ctx.user = await User.create({
        username,
        displayName,
        cardNumber,
        active,
    });

    if (role) await ctx.user.setRole(role.map(r => r.id));
    await next();

    ctx.body = ctx.user;
}

async function editUser(ctx, next) {
    let { username, displayName, cardNumber, active, role } = ctx.request.body;

    ctx.user.username = username;
    ctx.user.displayName = displayName;
    ctx.user.active = active;

    if (cardNumber) ctx.user.cardNumber = cardNumber;
    if (role) await ctx.user.setRole(role.map(r => r.id));

    await ctx.user.save();
    await next();

    ctx.body = ctx.user;
}

async function findUser(ctx, next) {
    let userId = (ctx.user && ctx.user.id) || ctx.params.userId || ctx.request.query.user_id ;
    let cardNumber = (ctx.user && ctx.user.cardNumber) || ctx.params.cardNumber  || ctx.request.query.card_number ||
                                                          ctx.params.tagId       || ctx.request.query.tag_id;

    let user;

    let includes = [
        {model: Role, as: 'role', include: {model: KeyGroup, as: 'keyGroup'}, through: {attributes:[]} },
        {model: KeyGroup, as: 'keyGroup', through: {attributes: []}},
    ];

    if (userId) {
        user = await User.findOne({
            where: {id: userId},
            include: includes
        });

    } else if (cardNumber) {
        user = await User.findOne({
            where: {cardNumber: cardNumber},
            include: includes
        });

    } else {
        throw new Error.BadRequest({
            message: 'Provide userId or cardNumber.'
        });

    }

    ctx.user = user;

    await next();
}

async function getAccessibleKeys(ctx, next) {
    if (ctx.user) {
        if (!ctx.user.accessible || !ctx.user.accessible.keyGroups)
            await getAccessibleKeyGroups(ctx, function() {});

        let keys = await Key.findAll({
            where: {key_group_id: ctx.user.accessible.keyGroups.map(kGp => kGp.id) }
        });

        ctx.user.accessible.keys = keys;
    }

    await next();
}

async function getAccessibleKeyGroups(ctx, next) {
    if (ctx.user) {
        let keyGroupsByUser = ctx.user.keyGroup;
        let keyGroupsByRole = ctx.user.role.map(r => r.keyGroup).flat();

        let keyGroups = [...keyGroupsByUser, ...keyGroupsByRole]
            .filter(
                (v,i,a) => i === a.findIndex(
                    t => (t.id === v.id)
                )
            );

        ctx.user.accessible = {keyGroups};
    }

    await next();
}

async function getUser(ctx, next) {
    if (ctx.user) {
        // clone user to avoid recursion
        let user = JSON.parse(JSON.stringify(ctx.user));

        // remove keyGroup attributes
        delete user.keyGroup;
        user.role.forEach(r => {delete r.keyGroup});

        // append accessible keys
        ctx.body = {
            ... user,
            keys: ctx.user.accessible.keys
        }
    }

    await next();
}

async function tokenise(ctx, next) {
    if (!ctx.user) return;

    let payload = {
        user: ctx.user,
    };

    let result = jwt.sign(payload, jwtSecret, {
        expiresIn: 15*60 //15 mins
    })

    ctx.body = {
        id: 0,
        username: 'admin',
        role: 'admin',
        token: result,
    };
    
    await next();
}

async function isUserAdmin(ctx, next) {
    if (!ctx.state.user || ctx.state.user.role !== 'admin') throw new Error.Forbidden();
    await next();
}

async function isUserActive(ctx, next) {
    if (ctx.user && !ctx.user.active) throw new Error.Forbidden();
    await next();
}

async function listUser(ctx, next) {
    let userWhere = ctx.filter.base || {};
    let roleWhere = ctx.filter.role || {};

    let query = {
        include: [
            {
                model: Role,
                as: 'role',
                through: { attributes: [] },
                include: {model: KeyGroup, as: 'keyGroup'},
                ... roleWhere
            },
            {
                model: KeyGroup,
                as: 'keyGroup',
                through: {attributes: []}
            },
        ],
        order: ctx.sort,
        ... userWhere,
    }

    let users = await User.findAll({
        ... query,
        // ... ctx.paginate,
    });

    let count = await User.count({
        ... query,
    })

    ctx.body = {
        data: users,
        count: count,
    };

    await next();
}

module.exports = {
    authenticate,
    createUser,
    editUser,
    findUser,
    getAccessibleKeys,
    getAccessibleKeyGroups,
    getUser,
    tokenise,
    isUserAdmin,
    isUserActive,
    listUser,
}