const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',       // <-- Change to your MySQL Workbench password
  database: 'luke_hospital'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL database: luke_hospital');
});

module.exports = db;
