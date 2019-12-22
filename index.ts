import * as express from "express";

let bootstrapper = require("./app/config/setup");

bootstrapper.bootstrap(express); // run server setup

module.exports = bootstrapper; // for tests