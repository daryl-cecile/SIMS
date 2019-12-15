const mysql = require('mysql');
const fs = require("fs");
const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) =>{

    let con = mysql.createConnection({
        host: process.env.SQL_IP,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASS,
        ssl:{
            ca: fs.readFileSync(__dirname + '/ssl/gcloud-ca.pem'),
            key: fs.readFileSync(__dirname + '/ssl/gcloud-key.pem'),
            cert: fs.readFileSync(__dirname + '/ssl/gcloud-cert.pem')
        }
    });

    con.connect(function(err) {
        if (err) {
            res.write("error");
        }
        else{
            res.write("Connected!");
        }
        res.end();
    });

});

app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});