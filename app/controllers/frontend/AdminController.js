"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouterSet_1 = require("../../config/RouterSet");
const Passport_1 = require("../../Services/Passport");
exports.AdminController = new RouterSet_1.RouterSet((router) => {
    router.get("/manage/inventory", async function (req, res) {
        res = await Passport_1.Passport.MakeAdminAccessOnly("Inventory", res);
        res.render("pages/inventory");
    });
    router.get("/manage/item/new", async function (req, res) {
        res = await Passport_1.Passport.MakeAdminAccessOnly("New Item", res);
        res.render("pages/manageItem", {
            title: 'Add new item',
            isNew: true
        });
    });
    router.get("/manage/item/edit", async function (req, res) {
        res = await Passport_1.Passport.MakeAdminAccessOnly("Edit Item", res);
        res.render("pages/manageItem", {
            title: 'Edit item > ',
            isNew: false
        });
    });
    return router;
});
//# sourceMappingURL=AdminController.js.map