"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRepository_1 = require("./BaseRepository");
const ItemModel_1 = require("../models/ItemModel");
const typeorm_1 = require("typeorm");
class repo extends BaseRepository_1.BaseRepository {
    constructor() {
        super(ItemModel_1.ItemModel);
    }
    async getByItemCode(itemCode) {
        return await this.repo.findOne({
            where: { id: itemCode }
        });
    }
    async findByText(text) {
        return await this.repo.find({
            where: { name: typeorm_1.Like(`%${text}%`) }
        });
    }
    async getAll() {
        return await this.repo.find({
            relations: ['inventoryEntry']
        });
    }
}
exports.ItemRepository = new repo();
//# sourceMappingURL=ItemRepository.js.map