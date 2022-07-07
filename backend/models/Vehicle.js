const db = require('../helpers/query.js');

const Vehicle = {}

Vehicle.insert = async (newVehicle) => {
  // driverName, companyName, license, druation, inboundDate, inboundTime, recordStatus, outboundDate, outboundTime
  return await db.query('insert into vehicle_status (inbound_guard_name, inbound_driver_name, inbound_company_name, inbound_license, inbound_destination, inbound_date, inbound_time) values(?, ?, ?, ?, ?, ?, ?)',
    [
      newVehicle.inbound_guard_name,
      newVehicle.inbound_driver_name,
      newVehicle.inbound_company_name,
      newVehicle.inbound_license,
      newVehicle.inbound_destination,
      newVehicle.inbound_date,
      newVehicle.inbound_time,
    ]);
}

Vehicle.update = async (id, updates) => {
  let query = 'update vehicle_status set inbound_guard_name=?, \
   inbound_driver_name=?, \
   inbound_company_name=?, \
   inbound_license=?, \
   inbound_destination=?, \
   inbound_date=?, \
   inbound_time=?, \
   outbound_guard_name=?, \
   outbound_date=?, \
   outbound_time=?, \
   calculated_duration_on_property=timestamp(?, ?)';
  //  calculated_duration_on_property=TIMEDIFF( timestamp(?, ?), timestamp(?, ?) )';
 /* let isFirst = true;
  for ( const key in updates ) {
    if ( isFirst ) {
      query += key + '=\'' + updates[key] + '\'';
      isFirst = false;
      continue;
    }
    query += ',' + key + '=\'' + updates[key] + '\' ';
  }*/
  query += ` where id=${id}`;
  return await db.query(query, [
    updates.inbound_guard_name,
    updates.inbound_driver_name,
    updates.inbound_company_name,
    updates.inbound_license,
    updates.inbound_destination,
    updates.inbound_date,
    updates.inbound_time,
    updates.outbound_guard_name,
    updates.outbound_date,
    updates.outbound_time,
    updates.outbound_date,
    updates.outbound_time,
  ]);
}

Vehicle.delete = async (id) => {
  return await db.query(`delete from vehicle_status where id=${id}`);
}

Vehicle.findAll = async () => {
  // return [
  //   {
  //     inbound_driver_name : 'a',
  //     inbound_company_name : 'a',
  //     inbound_license : 'a',
  //     calculated_duation_total : 'a',
  //     inbound_destination : 'a'
  //   },
  //   {
  //     inbound_driver_name : 'A',
  //     inbound_company_name : 'aC',
  //     inbound_license : 'a',
  //     calculated_duation_total : 'a',
  //     inbound_destination : 'a'
  //   },
  //   {
  //     inbound_driver_name : 'b',
  //     inbound_company_name : 'c',
  //     inbound_license : 'A',
  //     calculated_duation_total : 'ad',
  //     inbound_destination : 'D'
  //   },
  // ]
  return await db.query('SELECT *, TIMEDIFF(timestamp(inbound_date, inbound_time), NOW()) as calculated_duration from vehicle_status');
}

Vehicle.findById = async (id) => {
  return await db.query('SELECT * from vehicle_status where id=?', [id]);
}

module.exports = Vehicle