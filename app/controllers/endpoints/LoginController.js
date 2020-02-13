"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Passport_1 = require("../../Services/Passport");
const RouterSet_1 = require("../../config/RouterSet");
exports.LoginEndpointController = new RouterSet_1.RouterSet((router) => {
    router.post("/login/staff", async function (req, res) {
        let username = req.body['username'];
        let password = req.body['password'];
        let result = await Passport_1.Passport.authenticate(username, password, req, res);
        res.json(result.object);
        res.end();
    });
    router.post("/login/customer", async function (req, res) {
        let username = req.body['username'];
        let result = await Passport_1.Passport.authenticateCustomer(username, req, res);
        res.json(result.object);
        res.end();
    });
    return router;
});
//# sourceMappingURL=LoginController.js.map