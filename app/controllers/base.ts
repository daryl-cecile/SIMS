const home = require('express').Router();

home.get("/", function (req, res) {

    res.send("Hello World");

});

module.exports = home;