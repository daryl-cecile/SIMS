"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseService_1 = require("./BaseService");
const ItemModel_1 = require("../models/ItemModel");
const ItemRepository_1 = require("../Repository/ItemRepository");
const System_1 = require("../config/System");
const StorageLocationModel_1 = require("../models/StorageLocationModel");
class service extends BaseService_1.BaseService {
    async handleItemUpdate(req) {
        let inv = System_1.System.marshallToClass(req.body.entry, ItemModel_1.ItemModel);
        inv.storageLocation = System_1.System.marshallToClass(req.body.entry.storageLocation, StorageLocationModel_1.StorageLocationModel);
        inv.notices = req.body.entry.notices.split("\n");
        return await ItemRepository_1.ItemRepository.update(inv);
    }
    async handleItemDeletion(req) {
        await ItemRepository_1.ItemRepository.delete(await ItemRepository_1.ItemRepository.getByItemCode(req.body['data']['id']));
    }
}
exports.ItemService = new service();
//# sourceMappingURL=ItemService.js.map