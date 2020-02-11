"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouterSet_1 = require("../../config/RouterSet");
const InventoryRepository_1 = require("../../Repository/InventoryRepository");
const JSONResponse_1 = require("../../config/JSONResponse");
exports.InventoryEndpointController = new RouterSet_1.RouterSet((router) => {
    router.get("inventory/searchbyid", async function (req, res) {
        let searchResults = InventoryRepository_1.InventoryRepository.findByItemId(req.body["itemid"]);
        res.json(JSONResponse_1.JSONResponse(true, "Results", searchResults));
    });
    router.get("inventory/searchbyname", async function (req, res) {
        let searchResults = await InventoryRepository_1.InventoryRepository.findByText(req.body["term"]);
        res.json(JSONResponse_1.JSONResponse(true, "Results", searchResults));
    });
    return router;
});
//# sourceMappingURL=InventoryController.js.map