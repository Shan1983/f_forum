const environment = process.env.NODE_ENV || "development";
const knexConfig = require("../knexfile");
const envConfig = knexConfig[environment];
const knex = require("knex");
const connection = knex(envConfig);

module.exports = connection;
