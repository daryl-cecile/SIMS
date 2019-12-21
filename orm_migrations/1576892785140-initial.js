"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class initial1576892785140 {
    constructor() {
        this.name = 'initial1576892785140';
    }
    async up(queryRunner) {
        await queryRunner.query("CREATE TABLE `user_table` (`id` int NOT NULL AUTO_INCREMENT, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `test_table` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `test_table` ADD CONSTRAINT `FK_be34823538fc2f5cef75ca9938b` FOREIGN KEY (`userId`) REFERENCES `user_table`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `test_table` DROP FOREIGN KEY `FK_be34823538fc2f5cef75ca9938b`", undefined);
        await queryRunner.query("DROP TABLE `test_table`", undefined);
        await queryRunner.query("DROP TABLE `user_table`", undefined);
    }
}
exports.initial1576892785140 = initial1576892785140;
//# sourceMappingURL=1576892785140-initial.js.map