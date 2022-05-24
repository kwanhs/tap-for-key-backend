const { Key, KeyGroup, User, Role } = require('../model/index');
const Error = require('../helper/error');

async function getTag(ctx, next) {
    // ctx.silence = true;
    
    await next();

    if (ctx.user) {
        // ctx.body already set by UserController.getUser().
        // clone user to avoid recursion
        let body = JSON.parse(JSON.stringify(ctx.body));

        // wrap body into content attribute
        ctx.body = {
            type: 'user',
            content: body
        }
        
        return;

    } else if (ctx.key) {
        ctx.body = {
            type: 'key',
            content: ctx.key
        };

        return;

    } else {
        throw new Error.BadRequest({
            message: 'Provide tagId.'
        });

    }
}

module.exports = {
    getTag
}