"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Passport_1 = require("../Services/Passport");
const UserService_1 = require("../Services/UserService");
const home = require('express').Router();
home.get("/", async function (req, res) {
    let authCheck = await Passport_1.Passport.isAuthenticated(req, res);
    if (authCheck.object.isSuccessful) {
        let acc = authCheck.object.payload['user'];
        console.log(acc);
        if (await UserService_1.UserService.hasPermission(acc, "MANAGE")) {
            res.render("pages/manage", { user: acc });
        }
        else {
            res.render("pages/pos", { user: acc });
        }
    }
    else {
        res.redirect("/login");
    }
});
home.get("/login", async function (req, res) {
    res.redirect("/login/user");
});
home.get("/login/user", async function (req, res) {
    res.render("pages/login");
});
home.get("/login/staff", async function (req, res) {
    res.render("pages/admin-login");
});
home.get("/logout", async function (req, res) {
    await Passport_1.Passport.voidSession(req, res);
    res.redirect("/");
});
module.exports = home;
//# sourceMappingURL=base.js.map