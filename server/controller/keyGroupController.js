const { Key, KeyGroup, User, Role } = require('../model/index');
const Error = require('../helper/error');

async function createKeyGroup(ctx, next) {
    let { description, abbreviation, role } = ctx.request.body;

    ctx.keyGroup = await KeyGroup.create({
        description,
        abbreviation,
    })

    if (role) await ctx.keyGroup.setRole(role.map(r => r.id));
    await next();

    ctx.body = ctx.keyGroup;
}

async function deletekeyGroup(ctx, next) {
    let keyGroup = ctx.keyGroup;
    
    await keyGroup.setRole([]);
    await keyGroup.destroy()
    
    ctx.status = 200;
    await next();
}   

async function editKeyGroup(ctx, next) {
    let { description, abbreviation, role } = ctx.request.body;

    ctx.keyGroup.description = description;
    ctx.keyGroup.abbreviation = abbreviation;

    if (role) await ctx.keyGroup.setRole(role.map(r => r.id));

    await ctx.keyGroup.save();
    await next();

    ctx.body = ctx.keyGroup;
}

async function findKeyGroup(ctx, next) {
    let keyGroupId = (ctx.keyGroup && ctx.keyGroup.id) || ctx.params.keyGroupId || ctx.request.query.keygroup_id ;

    let keyGroup;

    let includes = [
        {model: Role, as: 'role', through: {attributes:[]} },
        {model: Key, as: 'key'},
    ];

    if (keyGroupId) {
        keyGroup = await KeyGroup.findOne({
            where: {id: keyGroupId},
            include: includes
        });

    } else {
        throw new Error.BadRequest({
            message: 'Provide keyGroupId.'
        });

    }

    ctx.keyGroup = keyGroup;

    await next();
}

async function listKeyGroup(ctx, next) {
    let keyGroupWhere = ctx.filter.base || {};
    let keyWhere = ctx.filter.key || {};

    let query = {
        include: [
            {
                model: Key,
                as: 'key',
                ... keyWhere
            },
            {
                model: Role,
                as: 'role',
                through: {attributes:[]}
            }
        ],
        order: ctx.sort,
        ... keyGroupWhere,
    };

    let keyGroups = await KeyGroup.findAll({
        ... query,
        // ... ctx.paginate,
    });

    let count = await KeyGroup.count({
        ... query,
    })

    ctx.body = {
        data: keyGroups,
        count: count,
    };

    await next();
}

module.exports = {
    createKeyGroup,
    deletekeyGroup,
    editKeyGroup,
    findKeyGroup,
    listKeyGroup,
}