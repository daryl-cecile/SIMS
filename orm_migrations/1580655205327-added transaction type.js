"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class addedTransactionType1580655205327 {
    constructor() {
        this.name = 'addedTransactionType1580655205327';
    }
    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `Transactions` ADD `transactionType` enum ('0', '1') NOT NULL DEFAULT '0'", undefined);
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `Transactions` DROP COLUMN `transactionType`", undefined);
    }
}
exports.addedTransactionType1580655205327 = addedTransactionType1580655205327;
//# sourceMappingURL=1580655205327-added transaction type.js.map