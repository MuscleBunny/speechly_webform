const db = require('../helpers/query.js');

const Vehicle = {}

Vehicle.insert = async (newVehicle) => {
  // driverName, companyName, license, druation, inboundDate, inboundTime, recordStatus, outboundDate, outboundTime
  return await db.query('insert into vehicle_status (driverName, companyName, license, druation, inboundDate, inboundTime, outboundDate, outboundTime, recordStatus) values(?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      newVehicle.driverName,
      newVehicle.companyName,
      newVehicle.license,
      newVehicle.druation,
      newVehicle.inboundDate,
      newVehicle.inboundTime,
      newVehicle.outboundDate,
      newVehicle.outboundTime,
      newVehicle.recordStatus,
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
  return [
    {
      inbound_driver_name : 'a',
      inbound_company_name : 'a',
      inbound_license : 'a',
      calculated_duation_total : 'a',
      inbound_destination : 'a'
    },
    {
      inbound_driver_name : 'A',
      inbound_company_name : 'aC',
      inbound_license : 'a',
      calculated_duation_total : 'a',
      inbound_destination : 'a'
    },
    {
      inbound_driver_name : 'b',
      inbound_company_name : 'c',
      inbound_license : 'A',
      calculated_duation_total : 'ad',
      inbound_destination : 'D'
    },
  ]
  // return await db.query('SELECT *, TIMEDIFF(timestamp(inbound_date, inbound_time), timestamp(outbound_date, outbound_time)) from vehicle_status');
}

Vehicle.findById = async (id) => {
  return await db.query('SELECT * from vehicle_status where id=?', [id]);
}

module.exports = Vehicle