const db = require('../helpers/query.js');

const Vehicle = {}

Vehicle.insert = async (newUser) => {
  // driverName, companyName, license, druation, inboundDate, inboundTime, recordStatus, outboundDate, outboundTime
  return await db.query('insert into vehicle_status (driverName, companyName, license, druation, inboundDate, inboundTime, outbou, recordStatus) values(?, ?, ?, ?, ?)',
    [
      newUser.username,
      newUser.fullname,
      newUser.contactphone,
      newUser.email,
      newUser.password
    ]);
}

Vehicle.update = async (id, updates) => {
  let query = 'update vehicle_status set ';
  let isFirst = true;
  for ( const key in updates ) {
    if ( isFirst ) {
      query += key + '=\'' + updates[key] + '\'';
      isFirst = false;
      continue;
    }
    query += ',' + key + '=\'' + updates[key] + '\' ';
  }
  query += `where id=${id}`;
  return await db.query(query);
}

Vehicle.delete = async (id) => {
  return await db.query(`delete from vehicle_status where id=${id}`);
}

Vehicle.findAll = async () => {
  return await db.query('SELECT * from vehicle_status');
}

Vehicle.findById = async (id) => {
  return await db.query('SELECT * from vehicle_status where id=?', [id]);
}

module.exports = Vehicle