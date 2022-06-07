require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DEVELOPMENT_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_TEST_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_PRODUCTION_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  gcpConnectLocal: {
    username: "postgres",
    password: "Bankai1010",
    database: "postgres",
    dialect: "postgres",
    host: "127.0.0.1",
    dialectOptions: {
      socketPath: "/cloudsql/trade-and-play:europe-west4:trade-and-play-db",
    },
  },
  gcpConnectCloudRun: {
    username: "postgres",
    password: "Bankai1010",
    database: "postgres",
    dialect: "postgres",
    host: "/cloudsql/trade-and-play:europe-west4:trade-and-play-db",
  },
};
