"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StaffModel_1 = require("../models/StaffModel");
const UserModel_1 = require("../models/UserModel");
const apis = require('express').Router();
const db = require("./../config/DBConnection");
apis.post("/login", async function (req, res) {
    let username = req.body['username'];
    let password = req.body['password'];
    res.end();
});
apis.get('/list/users', async function (req, res) {
    let userRepo = db.connection.getRepository(UserModel_1.UserModel);
    let finalList = {};
    (await userRepo.find()).forEach((user) => {
        finalList[user.email] = user.identifier;
    });
    res.write(JSON.stringify(finalList));
    res.end();
});
apis.get('/list/staffs', async function (req, res) {
    let staffRepo = db.connection.getRepository(StaffModel_1.StaffModel);
    let finalList = {};
    (await staffRepo.find()).forEach((staff) => {
        finalList[staff.email] = staff.identifier;
    });
    res.write(JSON.stringify(finalList));
    res.end();
});
module.exports = apis;
//# sourceMappingURL=apis.js.map