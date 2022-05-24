const ExtendableError = require('es6-error');
const httpStatus = require('http-status');
const chalk = require('chalk');

class BadRequest extends ExtendableError {
    constructor(error) {
        super(error)
        console.log(chalk.yellowBright(error.message));
        this.body = {
            message: error.message
        }
        this.status = httpStatus.BAD_REQUEST
    }
}

class Conflict extends ExtendableError {
    constructor() {
        super()
        this.body = 'Conflict'
        this.status = httpStatus.CONFLICT
    }
}

class TooManyRequests extends ExtendableError {
    constructor() {
        super()
        this.body = 'Too many requests'
        this.status = httpStatus.TOO_MANY_REQUESTS
    }
}

class Unauthorized extends ExtendableError {
    constructor() {
        super()
        this.body = 'Unauthorized'
        this.status = httpStatus.UNAUTHORIZED
    }
}

class Forbidden extends ExtendableError {
    constructor() {
        super()
        this.body = 'Unauthorized'
        this.status = httpStatus.FORBIDDEN
    }
}

class UnclosedDoor extends TooManyRequests {
    constructor(cellNumber) {
        super()
        this.body = {
            error: 'Unclosed Door',
            cellNumber,
        }
    }
}

module.exports = {
    BadRequest,
    Conflict,
    Forbidden,
    TooManyRequests,
    Unauthorized,
    UnclosedDoor,
}