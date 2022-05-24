const { Key, KeyGroup, User, Role } = require('../model/index');
const Error = require('../helper/error');

async function createRole(ctx, next) {
    let { description, abbreviation, user, keyGroup } = ctx.request.body;

    ctx.role = await Role.create({
        description,
        abbreviation,
    })

    if (user) await ctx.role.setUser(user.map(u => u.id));
    if (keyGroup) await ctx.role.setKeyGroup(keyGroup.map(kGp => kGp.id));

    await next();

    ctx.body = ctx.role;
}


async function deleteRole(ctx, next) {
    let role = ctx.role;
    
    await role.setUser([]);
    await role.setKeyGroup([]);
    await role.destroy()
    
    ctx.status = 200;
    await next();
}   

async function editRole(ctx, next) {
    let { description, abbreviation, user, keyGroup } = ctx.request.body;

    ctx.role.description = description;
    ctx.role.abbreviation = abbreviation;

    if (user) await ctx.role.setUser(user.map(u => u.id));
    if (keyGroup) await ctx.role.setKeyGroup(keyGroup.map(kGp => kGp.id));

    await ctx.role.save();
    await next();

    ctx.body = ctx.role;
}

async function findRole(ctx, next) {
    let roleId = (ctx.role && ctx.role.id) || ctx.params.roleId || ctx.request.query.role_id ;

    let role;

    let includes = [
        { model: KeyGroup, as: 'keyGroup' },
        { model: User, as: 'user', through: {attributes:[]} }
    ];

    if (roleId) {
        role = await Role.findOne({
            where: {id: roleId},
            include: includes
        });

    } else {
        throw new Error.BadRequest({
            message: 'Provide roleId.'
        });

    }

    ctx.role = role;

    await next();
}

async function listRole(ctx, next) {
    let roleWhere = ctx.filter.base || {};
    let keyGroupWhere = ctx.filter.keyGroup || {};

    let query = {
        include: [
            {
                model: KeyGroup,
                as: 'keyGroup',
                ... keyGroupWhere
            },

            {
                model: User,
                as: 'user',
                through: {attributes:[]}
            }
        ],
        order: ctx.sort,
        ... roleWhere
    }
    
    let roles = await Role.findAll({
        ... query,
        // ... ctx.paginate,
    });

    let count = await Role.count({
        ... query,
    })

    ctx.body = {
        data: roles,
        count: count,
    };

    await next();
}

module.exports = {
    createRole,
    deleteRole,
    editRole,
    findRole,
    listRole,
}