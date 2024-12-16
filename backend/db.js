const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' });

const urlDB = `mysql://uxz0qggbhfc3dsim:Zl0rLiT3BuIFrX7zllhf@bajvsp7e9c0lg8a22dcp-mysql.services.clever-cloud.com:3306/bajvsp7e9c0lg8a22dcp`

const db = mysql.createConnection(urlDB);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database');
});

module.exports = db;
