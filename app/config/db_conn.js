const mysql = require('mysql');
const cert = require('../config/cert_info');
let conn = mysql.createConnection({
    host: process.env.SQL_IP,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: "db_main",
    ssl: cert
});
conn.connect(function (err) {
    if (err) {
        console.error(err);
        throw err;
    }
    else {
        console.log("DB Connected!");
    }
});
module.exports = conn;
//# sourceMappingURL=db_conn.js.map