import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',  // Default MySQL user in XAMPP
  password: '',  // Leave empty if no password is set
  database: 'fashionfluent',  // Replace with your database name
});

export default db;
