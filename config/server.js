const corsOptions = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    keepHeadersOnError: true,
};

module.exports = {
    port: process.env['PORT'],
    corsOptions
}