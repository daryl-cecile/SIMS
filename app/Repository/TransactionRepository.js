"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRepository_1 = require("./BaseRepository");
const TransactionsModel_1 = require("../models/TransactionsModel");
class repo extends BaseRepository_1.BaseRepository {
    constructor() {
        super(TransactionsModel_1.TransactionsModel);
    }
    async getByItemCode(itemCode) {
        return await this.repo.findOne({
            where: { id: itemCode }
        });
    }
}
exports.TransactionRepository = new repo();
//# sourceMappingURL=TransactionRepository.js.map