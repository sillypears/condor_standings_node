const dotenv = require('dotenv').config();
const mysql = require('mysql');

const conn = mysql.createPool({
    host    : process.env.DB_HOST,
    user    : process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEMA,
    connectionLimit: 2
  });
  

module.exports = conn;