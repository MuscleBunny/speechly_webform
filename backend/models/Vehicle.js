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
   record_status=?';
  query += ` where id=${id}`;
  await db.query(query, [
    updates.inbound_guard_name ? updates.inbound_guard_name : '',
    updates.inbound_driver_name ? updates.inbound_driver_name : '',
    updates.inbound_company_name ? updates.inbound_company_name : '',
    updates.inbound_license ? updates.inbound_license : '',
    updates.inbound_destination ? updates.inbound_destination : '',
    updates.inbound_date ? updates.inbound_date : '',
    updates.inbound_time ? updates.inbound_time : '',
    updates.outbound_guard_name ? updates.outbound_guard_name : '',
    updates.outbound_date ? updates.outbound_date : '',
    updates.outbound_time ? updates.outbound_time : '',
    updates.record_status ? updates.record_status : '',
  ]);
  return await db.query('update vehicle_status set calculated_duration_on_property=TIMESTAMPDIFF(HOUR, TIMESTAMP(inbound_date, inbound_time), TIMESTAMP(outbound_date, outbound_time)) ' +  `where id=${id}`);
}

Vehicle.delete = async (id) => {
  return await db.query(`delete from vehicle_status where id=${id}`);
}

Vehicle.findAll = async () => {
  return await db.query('SELECT *, TIMESTAMPDIFF(HOUR, timestamp(inbound_date, inbound_time), NOW()) as calculated_duration from vehicle_status where record_status=1');
}

Vehicle.findById = async (id) => {
  return await db.query('SELECT * from vehicle_status where id=?', [id]);
}

module.exports = Vehicle