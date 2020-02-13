"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
let path = require("path");
let bootstrapper = require("./app/config/setup");
bootstrapper.setStoragePath(path.join(__dirname, 'storage'));
bootstrapper.bootstrap(express);
module.exports = bootstrapper;
//# sourceMappingURL=index.js.map