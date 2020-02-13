"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouterSet_1 = require("../../config/RouterSet");
exports.TransactionController = new RouterSet_1.RouterSet((router) => {
    router.get("/confirm", async function (req, res) {
        res.render("pages/confirm_transaction");
    });
    router.get("/help", async function (req, res) {
        res.render("pages/help");
    });
    return router;
});
//# sourceMappingURL=TransactionController.js.map