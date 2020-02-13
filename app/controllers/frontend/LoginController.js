"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Passport_1 = require("../../Services/Passport");
const UserService_1 = require("../../Services/UserService");
const RouterSet_1 = require("../../config/RouterSet");
const FSManager_1 = require("../../config/FSManager");
exports.LoginController = new RouterSet_1.RouterSet((router) => {
    router.get("/", async function (req, res) {
        let authCheck = await Passport_1.Passport.isAuthenticated(req, res);
        if (authCheck.object.isSuccessful) {
            let acc = authCheck.object.payload['user'];
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
    router.get("/login", async function (req, res) {
        res.redirect("/login/user");
    });
    router.get("/login/user", async function (req, res) {
        res.render("pages/login");
    });
    router.get("/login/staff", async function (req, res) {
        res.render("pages/admin-login");
    });
    router.get("/logout", async function (req, res) {
        await Passport_1.Passport.voidSession(req, res);
        res.redirect("/");
    });
    router.get("/test", async function (req, res) {
        console.log(FSManager_1.FSManager.getIncomingFiles());
        console.log(req.body['namef']);
        res.write("DONE");
        res.end();
    });
    return router;
});
//# sourceMappingURL=LoginController.js.map