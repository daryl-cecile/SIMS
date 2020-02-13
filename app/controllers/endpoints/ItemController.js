"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouterSet_1 = require("../../config/RouterSet");
const JSONResponse_1 = require("../../config/JSONResponse");
const ItemRepository_1 = require("../../Repository/ItemRepository");
const InventoryRepository_1 = require("../../Repository/InventoryRepository");
exports.ItemsEndpointController = new RouterSet_1.RouterSet((router) => {
    router.get("/items/searchbyname", async function (req, res) {
        let searchResults = await ItemRepository_1.ItemRepository.findByText(req.body["term"]);
        res.json(JSONResponse_1.JSONResponse(true, "Results", searchResults));
    });
    router.get("/items/searchbyid", async function (req, res) {
        let searchResults = await ItemRepository_1.ItemRepository.getByItemCode(req.body["itemID"]);
        res.json(JSONResponse_1.JSONResponse(true, "Results", searchResults));
    });
    router.get("/items/itemlist", async function (req, res) {
        let listResults = await InventoryRepository_1.InventoryRepository.getAll();
        res.json(JSONResponse_1.JSONResponse(true, "InventoryList", {
            items: listResults
        }));
    });
    return router;
});
//# sourceMappingURL=ItemController.js.map