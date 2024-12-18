const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' });

const urlDB = process.env.DB_URL;

const db = mysql.createConnection(urlDB);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database');
});

module.exports = db;
