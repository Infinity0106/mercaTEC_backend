module.exports = {
  development: {
    username: "daw_dev",
    password: "1234567890",
    database: "DAW_development",
    host: "127.0.0.1",
    dialect: "postgres",
    migrationStorage: "json",
    seederStorage: "json"
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    dialect: "mysql"
  }
};
