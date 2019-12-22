"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
let bootstrapper = require("./app/config/setup");
bootstrapper.bootstrap(express);
module.exports = bootstrapper;
//# sourceMappingURL=index.js.map