require('@journeyapps/sqlcipher');
require('serialport');
require('@serialport/parser-inter-byte-timeout')
require('mysql2');
require('dotenv').config();

const koa = require('koa');
const cors = require('@koa/cors');
const serve = require('koa-static');

const routes = require('./server/routes')
const server = require('./config/server');
const { cabin } = require('./config/cabin');
const { DISABLE_CHECK, OPEN_ALL } = require('./config/argv')

const { sequelize } = require('./server/model');
const chalk = require('chalk');


var app = new koa();

function initializeApp() {
  if (!sequelize.ready || !cabin.ready) return;

  app.listen(server.port, () => {
    console.log(`API server listening on port ${server.port}!`);
  });
}

app
  .use(cors(server.corsOptions))
  .use(serve('./public'))
  .use(routes.routes())
  .use(routes.allowedMethods())
  .on('db-ready', initializeApp)
  .on('cabin-ready', initializeApp);

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected.');
    sequelize.ready = true;
    app.emit('db-ready');
  })
  .catch(error => {
    console.log(chalk.red(`Database NOT connected. [${error.message}]`));

    if (!DISABLE_CHECK) {
      sequelize.ready = false
    } else {
      sequelize.ready = true;
      app.emit('db-ready');
    }
  });

cabin
  .initialize(error => {
    if (error) {
      console.log(chalk.red(`Cabin NOT connected. [${error.message}]`));

      if (!DISABLE_CHECK) {
        cabin.ready = false
      } else {
        cabin.ready = true;
        app.emit('cabin-ready');
      }

    } else {
      console.log('Cabin connected.');
      cabin.ready = true;
      app.emit('cabin-ready');
      
    }
    
      
    if (OPEN_ALL && cabin.ready) openAllCells(cabin, 1);
  })
    
function openAllCells(cabin, cellNo) {
  console.log(`Opening #${cellNo}.`)
  cabin.cells[cellNo].open();
  if (cellNo<28) {
    setTimeout(() => openAllCells(cabin,cellNo+1), 1000);
  }
}