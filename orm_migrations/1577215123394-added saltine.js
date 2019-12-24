"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class addedSaltine1577215123394 {
    constructor() {
        this.name = 'addedSaltine1577215123394';
    }
    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `users` ADD `saltine` varchar(255) NULL", undefined);
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `saltine`", undefined);
    }
}
exports.addedSaltine1577215123394 = addedSaltine1577215123394;
//# sourceMappingURL=1577215123394-added saltine.js.map