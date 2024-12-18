const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' });

const urlDB = `mysql://todoapp_guidebatat:7a0ed7727b48f46f019615525245b3e4e08f807b@85-2e.h.filess.io:3306/todoapp_guidebatat`

const db = mysql.createConnection(urlDB);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database');
});

module.exports = db;
