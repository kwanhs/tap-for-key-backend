
const passport = require('koa-passport');
const passportJWT = require('passport-jwt');
const Error = require('../server/helper/error');

const jwtSecret = process.env['JWT_SECRET'] || 'jwt!Secr3t@2022'
const adminUser = process.env['ADMIN_USERNAME'] || 'admin'
const adminPwd = process.env['ADMIN_PASSWORD'] || 'admin'

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const opts = {
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt')
}

const strategy = new JwtStrategy(opts, async function (jwt_payload, next) {
    try {
        const user = jwt_payload.user;
        if (user.username !== adminUser) throw new Error.Unauthorized();
        return next(null, user)
    }
    catch (error) {
        return next(error)
    }
})

passport.use(strategy)

module.exports = {
    passport,
    jwtSecret,
    adminUser,
    adminPwd,
}