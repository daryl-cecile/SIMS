const mysql = require('mysql');
const apis = require('express').Router();
const cert = require('../config/cert_info');
apis.get("/test-db", function (req, res) {
    let con = mysql.createConnection({
        host: process.env.SQL_IP,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASS,
        ssl: cert
    });
    con.connect(function (err) {
        if (err) {
            res.write("error");
        }
        else {
            res.write("Connected!");
        }
        res.end();
    });
});
apis.post("/login", function (req, res) {
    let username = req.body['username'];
    let password = req.body['password'];
});
apis.get('/user_info/:username', function (req, res) {
    let username = req.params['username'];
});
module.exports = apis;
//# sourceMappingURL=apis.js.map