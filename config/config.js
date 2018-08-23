var Op = require("sequelize").Op;
module.exports = {
  development: {
    username: "daw_dev",
    password: "1234567890",
    database: "DAW_development",
    host: "127.0.0.1",
    dialect: "postgres",
    migrationStorage: "json",
    seederStorage: "json",
    operatorsAliases: Op
  },
  test: {
    username: "daw_test",
    password: "1234567890",
    database: "DAW_test",
    host: "127.0.0.1",
    dialect: "postgres",
    migrationStorage: "json",
    seederStorage: "json",
    operatorsAliases: Op,
    logging: false
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    dialect: "mysql",
    operatorsAliases: Op
  }
};
