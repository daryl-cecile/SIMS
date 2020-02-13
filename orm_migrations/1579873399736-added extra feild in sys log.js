"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class addedExtraFeildInSysLog1579873399736 {
    constructor() {
        this.name = 'addedExtraFeildInSysLog1579873399736';
    }
    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `sims-logs` ADD `extraInformation` text NOT NULL", undefined);
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `sims-logs` DROP COLUMN `extraInformation`", undefined);
    }
}
exports.addedExtraFeildInSysLog1579873399736 = addedExtraFeildInSysLog1579873399736;
//# sourceMappingURL=1579873399736-added extra feild in sys log.js.map