"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRepository_1 = require("./BaseRepository");
const InventoryModel_1 = require("../models/InventoryModel");
const typeorm_1 = require("typeorm");
class repo extends BaseRepository_1.BaseRepository {
    constructor() {
        super(InventoryModel_1.InventoryModel);
    }
    async findByItemId(itemID) {
        return await this.repo.findOne({
            where: {
                item: { id: itemID }
            }
        });
    }
    async findByText(text) {
        return await this.repo.find({
            where: { name: typeorm_1.Like(`%${text}%`) }
        });
    }
    async getAll() {
        return await this.repo.find({
            relations: ['item', 'item.notices']
        });
    }
}
exports.InventoryRepository = new repo();
//# sourceMappingURL=InventoryRepository.js.map