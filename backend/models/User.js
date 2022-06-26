const db = require('../helpers/query.js');

const User = {}

User.insert = async (newUser) => {
  return await db.query('insert into users (username, fullname, contactphone, email, password) values(?, ?, ?, ?, ?)',
    [
      newUser.username,
      newUser.fullname,
      newUser.contactphone,
      newUser.email,
      newUser.password
    ]);
}

User.update = async (id, updates) => {
  let query = 'update users set ';
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

User.delete = async () => {
}

User.findAll = async () => {
  return await db.query('SELECT * from users');
}

User.findById = async (id) => {
  return await db.query('SELECT * from users where id=?', [id]);
}

module.exports = User