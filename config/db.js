const Sequelize = require('sequelize');
const path = require('path');

const DB_TYPE = process.env['DB_TYPE'] === undefined ?
  'mysql' :
  process.env['DB_TYPE'].toLowerCase()

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
} = process.env

switch (DB_TYPE) {
  case 'sqlite':
    var sequelize = new Sequelize({
        dialect: 'sqlite',
        dialectModulePath: '@journeyapps/sqlcipher',
        storage: process.env['DB_PATH'],
        logging: false,
      }
    );
    
    sequelize.query("PRAGMA key = 'keys@qeh2020'");
    sequelize.query('PRAGMA cipher_default_compatibility  = 3');

    break;

  case 'mysql':
  default:
    var sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
        host: process.env['DB_PATH'],
        port: process.env['DB_PORT'],
        dialect: 'mysql',
        timezone: 'Asia/Hong_Kong',
    
        dialectOptions: {
          timezone: "local",
        },
      
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        },
        
        logging: false,
      }
    );

    break;
}

module.exports = sequelize;