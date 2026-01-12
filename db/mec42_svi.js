// db/central.js
const { Pool } = require('pg');
require('dotenv').config();

const centralPool = new Pool({
  host: process.env.CENTRAL_DB_HOST,
  port: process.env.CENTRAL_DB_PORT,
  user: process.env.CENTRAL_DB_USER,
  password: process.env.CENTRAL_DB_PASSWORD,
  database: process.env.CENTRAL_DB_NAME,
});

module.exports = centralPool;
