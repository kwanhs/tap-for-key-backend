const Error = require('../helper/error')

const { cabin, NO_DOOR_CHECK } = require('../../config/cabin');

async function allCellsClosed(ctx, next) {
    try {
        if (!NO_DOOR_CHECK)
            for (let cell=1; cell<cabin.numberOfCells+1; cell++) {
                if (cabin.cells[cell].isOpened())
                    throw new Error.UnclosedDoor(cell);
            }

        await next();

    } catch(e) {
        ctx.body = e.body
        ctx.status = e.status
    }
}

async function openCellForKey(ctx, next) {
    let { cellNumber } = ctx.key;
    cabin.cells[cellNumber].open();
    await next();
}

async function update(ctx, next) {
    cabin.update()
    await next();
}

module.exports = {
    allCellsClosed,
    openCellForKey,
    update,
}