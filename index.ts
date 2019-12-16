const express = require('express');

let server = require("./app/config/setup")(express);

module.exports = server; // for tests