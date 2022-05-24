
const { Log, User } = require('../model');
const key = require('../model/key');

async function listLog(ctx, next) {
    let query = {
        include: [
            {
                model: User,
                as: 'user'
            }
        ],
        order: ctx.sort,
        where: [
            {key_id: ctx.key.id}
            // column aliases cannot be used in SQL WHERE clauses 
            // sequelize fails to do the conversion by itself
        ]
    };

    let logs = await Log.findAll({
        ... query,
        ... ctx.paginate,
    });

    let count = await Log.count({
        ... query,
    })

    ctx.body = {
        data: logs,
        count: count,
    };
    
    await next();
}

async function logAction(ctx, action) {
    let log = await Log.create({
        userId: ctx.user.id,
        keyId: ctx.key.id,
        action: action
    });

    return log;
}

async function logRetrieve(ctx, next) {
    ctx.body = await logAction(ctx, 'retrieve')
    await next();    
}

async function logReturn(ctx, next) {
    ctx.body = await logAction(ctx, 'return')
    await next();
}

module.exports ={
    listLog,
    logRetrieve,
    logReturn,
}