"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Passport_1 = require("../Services/Passport");
const UserService_1 = require("../Services/UserService");
const apis = require('express').Router();
apis.post("/login/staff", async function (req, res) {
    let username = req.body['username'];
    let password = req.body['password'];
    let result = await Passport_1.Passport.authenticate(username, password, req, res);
    res.json(result.object);
    res.end();
});
apis.post("/login/customer", async function (req, res) {
    let username = req.body['username'];
    let result = await Passport_1.Passport.authenticateCustomer(username, req, res);
    res.json(result.object);
    res.end();
});
apis.get('/list/users', async function (req, res) {
    let term = (req.query['hint'] || "=").toLowerCase();
    if (term.length < 1) {
        res.end();
        return;
    }
    let finalList = {};
    (await UserService_1.UserService.getAllCustomers()).forEach((user) => {
        if (user.email.toLowerCase().startsWith(term) || user.identifier.toLowerCase().indexOf(term) > -1)
            finalList[user.email] = user.identifier;
    });
    res.json(finalList);
    res.end();
});
module.exports = apis;
//# sourceMappingURL=apis.js.map