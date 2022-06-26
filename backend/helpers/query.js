const mysql = require('mysql2/promise');
const config = require('../config/db.config');

let connection;
init();

async function init() {
  connection = await mysql.createConnection(config)
}

async function query(sql, params) {
  const [results, ] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query
}