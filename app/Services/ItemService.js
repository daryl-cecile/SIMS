"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseService_1 = require("./BaseService");
const ItemRepository_1 = require("../Repository/ItemRepository");
const InventoryModel_1 = require("../models/InventoryModel");
const InventoryRepository_1 = require("../Repository/InventoryRepository");
const NoticeModel_1 = require("../models/NoticeModel");
class service extends BaseService_1.BaseService {
    async handleItemCreation(req) {
        var _a;
        let tempInventory = new InventoryModel_1.InventoryModel();
        let tempItem = req.body['data']['item'];
        tempItem.notices = (_a = req.body['data']['notices']) === null || _a === void 0 ? void 0 : _a.map(title => {
            let temp = new NoticeModel_1.NoticeModel();
            temp.title = title;
            return temp;
        });
        tempInventory.item = tempItem;
        tempInventory.quantity = req.body['data']['quantity'];
        await InventoryRepository_1.InventoryRepository.update(tempInventory);
    }
    async handleItemDeletion(req) {
        await ItemRepository_1.ItemRepository.delete(await ItemRepository_1.ItemRepository.getByItemCode(req.body['data']['id']));
    }
}
exports.ItemService = new service();
//# sourceMappingURL=ItemService.js.map