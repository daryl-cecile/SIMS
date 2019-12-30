"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class addedSystemLogEntryModelForSystemLogsInDb1577558305567 {
    constructor() {
        this.name = 'addedSystemLogEntryModelForSystemLogsInDb1577558305567';
    }
    async up(queryRunner) {
        await queryRunner.query("CREATE TABLE `sims-logs` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(255) NULL, `message` varchar(255) NOT NULL, `err-code` varchar(12) NULL, `reference` varchar(255) NOT NULL, `expiry` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }
    async down(queryRunner) {
        await queryRunner.query("DROP TABLE `sims-logs`", undefined);
    }
}
exports.addedSystemLogEntryModelForSystemLogsInDb1577558305567 = addedSystemLogEntryModelForSystemLogsInDb1577558305567;
//# sourceMappingURL=1577558305567-added SystemLogEntryModel for system logs in db.js.map