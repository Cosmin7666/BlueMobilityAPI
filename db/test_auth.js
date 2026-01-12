// db/auth.js
const { Pool } = require('pg');
require('dotenv').config();

const authPool = new Pool({
  host: process.env.AUTH_DB_HOST,
  port: process.env.AUTH_DB_PORT,
  user: process.env.AUTH_DB_USER,
  password: process.env.AUTH_DB_PASSWORD,
  database: process.env.AUTH_DB_NAME,
});

module.exports = authPool;
