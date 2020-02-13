"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class changedToNullable1579873518177 {
    constructor() {
        this.name = 'changedToNullable1579873518177';
    }
    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `sims-logs` CHANGE `extraInformation` `extraInformation` text NULL", undefined);
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `sims-logs` CHANGE `extraInformation` `extraInformation` text NOT NULL", undefined);
    }
}
exports.changedToNullable1579873518177 = changedToNullable1579873518177;
//# sourceMappingURL=1579873518177-changed to nullable.js.map