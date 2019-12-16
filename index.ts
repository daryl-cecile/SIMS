const express = require('express');

let app = require("./app/config/setup")(express);

export default app; // for tests