import * as express from "express";

let path = require("path");
let bootstrapper = require("./app/config/setup");

bootstrapper.setStoragePath( path.join(__dirname, 'public','storage') );

bootstrapper.bootstrap(express); // run server setup

module.exports = bootstrapper; // for tests