const { Key, KeyGroup, Log, User } = require('../model/index');
const Error = require('../helper/error')

async function createKey(ctx, next) {
    let { cellNumber, description, keyGroupId, keyTagNumber } = ctx.request.body;
    
    ctx.key = await Key.create({
        cellNumber,
        description,
        keyGroupId, 
        keyTagNumber
    });

    await next();

    ctx.body = ctx.key;
}

async function editKey(ctx, next) {
    let { cellNumber, description, keyGroupId, keyTagNumber } = ctx.request.body;

    if ((cellNumber  && ctx.key.cellNumber   !== cellNumber  ) ||
        (description && ctx.key.description  !== description ) ||
        (keyGroupId  && ctx.key.keyGroupId   !== keyGroupId  ) ||
        keyTagNumber) {

        ctx.key.cellNumber = cellNumber;
        ctx.key.description = description;
        ctx.key.keyGroupId = keyGroupId;

        if (keyTagNumber) ctx.key.keyTagNumber = keyTagNumber;
    
        await ctx.key.save();
        await next();

    }

    ctx.body = ctx.key;
}

async function findKey(ctx, next) {
    let keyId = (ctx.key && ctx.key.id) || ctx.params.keyId || ctx.request.query.key_id;
    let keyTagNumber = (ctx.key && ctx.key.keyTagNumber) || ctx.params.keyTagNumber  || ctx.request.query.key_tag_number ||
                                ctx.params.tagId         || ctx.request.query.tag_id;

    let key;

    let includes = [
        {
            model: Log,
            as: 'log',
            limit: 10,
            order: [
                ['createdAt', 'desc']
            ],
            include: [
                {
                    model: User,
                    as: 'user'
                }
            ]
        },
        {
            model: KeyGroup,
            as: 'keyGroup'
        }
    ];

    if (keyId) {
        key = await Key.findOne({
            where: {id: keyId},
            include: includes
        });

    } else if (keyTagNumber) {
        key = await Key.findOne({
            where: {keyTagNumber: keyTagNumber},
            include: includes
        });

    } else {
        throw new Error.BadRequest({
            message: 'Provide keyId or keyTagNumber.'
        });

    }

    ctx.key = key;
    await next();
}

async function getKey(ctx) {
    ctx.body = ctx.key;
}

async function isKeyAccessible(ctx, next) {
    let accessByUser = await ctx.key.keyGroup.getUser({
        limit: 1,
        where: {id: ctx.user.id}
    });

    let accessByRole = await ctx.key.keyGroup.getRole({
        limit: 1,
        where: {id: ctx.user.role.map(r => r.id)}
    });

    // if (accessByUser.length) console.log('Accessible by User.')
    // if (accessByRole.length) console.log('Accessible by Role.')

    if (!accessByUser.length && !accessByRole.length) throw new Error.Unauthorized();

    await next();
}

async function isKeyRetrieved(ctx, next) {
    let isRetrieved = await ctx.key.isRetrieved();
    if (!isRetrieved) throw new Error.Conflict();
    await next();
}

async function isKeyReturned(ctx, next) {
    let isReturned = await ctx.key.isReturned();
    if (!isReturned) throw new Error.Conflict();
    await next();
}

async function listKey(ctx, next) {
    let keyWhere = ctx.filter.base || {};
    let keyGroupWhere = ctx.filter.keyGroup || {};

    let query = {
        include: [
            {
                model: Log,
                as: 'log',
                limit: 10,
                order: [
                    ['createdAt', 'desc']
                ],
                include: [
                    {
                        model: User,
                        as: 'user'
                    }
                ]
            },
            {
                model: KeyGroup,
                as: 'keyGroup',
                ... keyGroupWhere
            }
        ],
        order: ctx.sort,
        ... keyWhere
    };

    let keys = await Key.findAll({
        ... query,
        // ... ctx.paginate,
    });

    let count = await Key.count({
        ... query,
    })

    ctx.body = {
        data: keys,
        count: count,
    };
    
    await next();
}

module.exports = {
    createKey,
    editKey,
    findKey,
    getKey,
    isKeyAccessible,
    isKeyRetrieved,
    isKeyReturned,
    listKey,
}