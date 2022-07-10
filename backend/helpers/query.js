const mysql = require('mysql2/promise');
const config = require('../config/db.config');
var Client = require('ssh2').Client;
var ssh = new Client();

// let connection;
// init();

const init = () => {
  db().then(function(val){
    connection = val;
  });
}

var db = new Promise( function(resolve, reject){
  ssh.on('ready', function() {
    ssh.forwardOut(
      '127.0.0.1',
      '32564',
      config.dbServer.host,
      config.dbServer.port,
      async function(err, stream) {
        if  ( err ) throw err;
        connection = await mysql.createConnection({
          host     : config.dbServer.host,
          user     : config.dbServer.user,
          password : config.dbServer.password,
          database : config.dbServer.database,
          stream: stream
        })
        resolve(connection);
        /*connection.connect(function(err){
          console.log('success', err, connection);
          if (!err) {
            resolve(connection);
          } else {
            reject(err);
          }
        });*/
      }
    )
  }).connect({
	  host: config.tunnelConfig.host,
	  port: config.tunnelConfig.port,
	  username: config.tunnelConfig.username,
	  password: config.tunnelConfig.password
	});
});

async function query(sql, params) {
  var connection = await db;
  const [results, ] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query
}