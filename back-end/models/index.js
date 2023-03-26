"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const db = {};
const CONFIG = require("../config/config");

// const sequelize = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password, {
//   host: CONFIG.db_host,
//   dialect: CONFIG.db_dialect,
//   port: CONFIG.db_port,
//   define: {
//     charset: 'utf8',
//     collate: 'utf8_unicode_ci',
//   },
//   dialectOptions: {
//     charset: 'utf8',
//     collate: 'utf8_unicode_ci',
//     useUTC: false
//   },
//   operatorsAliases: false,
//    timezone: '-07:00',

// });

const sequelize = new Sequelize(
  CONFIG.db_name,
  CONFIG.db_user,
  CONFIG.db_password,
  {
    host: CONFIG.db_host,
    dialect: CONFIG.db_dialect,
    dialectOptions: {
      options: {
        // Your tedious options here
        useUTC: false,
        dateFirst: 1,
        timezone: "-07:00",
      },
    },
    operatorsAliases: false,
  }
);
// console.log('sequelize:::::', sequelize);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    let model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
