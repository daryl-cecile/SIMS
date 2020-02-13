import {MigrationInterface, QueryRunner} from "typeorm";

export class addedCascade1581553401452 implements MigrationInterface {
    name = 'addedCascade1581553401452'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `sessions` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `sessionKey` varchar(255) NOT NULL, `expiry` datetime NOT NULL, `invalid` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX `IDX_1ae515ea2b66b030cf3f5e5ba8` (`sessionKey`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `permission` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `transaction-entry` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `itemId` int NOT NULL, `quantity` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `Transactions` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `transactionType` enum ('0', '1') NOT NULL DEFAULT '0', `userOwnerId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `firstName` varchar(255) NULL, `lastName` varchar(255) NULL, `email` varchar(255) NULL, `identifier` varchar(8) NOT NULL, `password_hash` varchar(255) NULL, `saltine` varchar(255) NULL, `currentSessionId` int NULL, UNIQUE INDEX `IDX_2e7b7debda55e0e7280dc93663` (`identifier`), UNIQUE INDEX `REL_aad9d010f8b7d5f1367e002487` (`currentSessionId`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `storageLocations` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `location` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `items` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `description` text NOT NULL, `notices` text NOT NULL, `unitCount` int NOT NULL DEFAULT 1, `previewImg` varchar(255) NULL, `expiry` datetime NULL, `quantity` int NOT NULL DEFAULT 1, `storageLocationId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `sims-logs` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(255) NULL, `message` varchar(255) NOT NULL, `extraInformation` text NULL, `err-code` varchar(12) NULL, `reference` varchar(255) NOT NULL, `expiry` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `transactions_entries_transaction-entry` (`transactionsId` int NOT NULL, `transactionEntryId` int NOT NULL, INDEX `IDX_99747526740fa42ac3009bf208` (`transactionsId`), INDEX `IDX_1f7303010ea58156a6b0446f13` (`transactionEntryId`), PRIMARY KEY (`transactionsId`, `transactionEntryId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `users_permissions_permission` (`usersId` int NOT NULL, `permissionId` int NOT NULL, INDEX `IDX_a8ae4c08841340a12bb7e2db62` (`usersId`), INDEX `IDX_bb779b42732e822b848f9f32ad` (`permissionId`), PRIMARY KEY (`usersId`, `permissionId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `Transactions` ADD CONSTRAINT `FK_f2a658c1c81c171c3f9f2531d27` FOREIGN KEY (`userOwnerId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `users` ADD CONSTRAINT `FK_aad9d010f8b7d5f1367e002487c` FOREIGN KEY (`currentSessionId`) REFERENCES `sessions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `items` ADD CONSTRAINT `FK_8b235527408207cd1bcbd2be084` FOREIGN KEY (`storageLocationId`) REFERENCES `storageLocations`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `transactions_entries_transaction-entry` ADD CONSTRAINT `FK_99747526740fa42ac3009bf2087` FOREIGN KEY (`transactionsId`) REFERENCES `Transactions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `transactions_entries_transaction-entry` ADD CONSTRAINT `FK_1f7303010ea58156a6b0446f131` FOREIGN KEY (`transactionEntryId`) REFERENCES `transaction-entry`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `users_permissions_permission` ADD CONSTRAINT `FK_a8ae4c08841340a12bb7e2db62a` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `users_permissions_permission` ADD CONSTRAINT `FK_bb779b42732e822b848f9f32ad5` FOREIGN KEY (`permissionId`) REFERENCES `permission`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `users_permissions_permission` DROP FOREIGN KEY `FK_bb779b42732e822b848f9f32ad5`", undefined);
        await queryRunner.query("ALTER TABLE `users_permissions_permission` DROP FOREIGN KEY `FK_a8ae4c08841340a12bb7e2db62a`", undefined);
        await queryRunner.query("ALTER TABLE `transactions_entries_transaction-entry` DROP FOREIGN KEY `FK_1f7303010ea58156a6b0446f131`", undefined);
        await queryRunner.query("ALTER TABLE `transactions_entries_transaction-entry` DROP FOREIGN KEY `FK_99747526740fa42ac3009bf2087`", undefined);
        await queryRunner.query("ALTER TABLE `items` DROP FOREIGN KEY `FK_8b235527408207cd1bcbd2be084`", undefined);
        await queryRunner.query("ALTER TABLE `users` DROP FOREIGN KEY `FK_aad9d010f8b7d5f1367e002487c`", undefined);
        await queryRunner.query("ALTER TABLE `Transactions` DROP FOREIGN KEY `FK_f2a658c1c81c171c3f9f2531d27`", undefined);
        await queryRunner.query("DROP INDEX `IDX_bb779b42732e822b848f9f32ad` ON `users_permissions_permission`", undefined);
        await queryRunner.query("DROP INDEX `IDX_a8ae4c08841340a12bb7e2db62` ON `users_permissions_permission`", undefined);
        await queryRunner.query("DROP TABLE `users_permissions_permission`", undefined);
        await queryRunner.query("DROP INDEX `IDX_1f7303010ea58156a6b0446f13` ON `transactions_entries_transaction-entry`", undefined);
        await queryRunner.query("DROP INDEX `IDX_99747526740fa42ac3009bf208` ON `transactions_entries_transaction-entry`", undefined);
        await queryRunner.query("DROP TABLE `transactions_entries_transaction-entry`", undefined);
        await queryRunner.query("DROP TABLE `sims-logs`", undefined);
        await queryRunner.query("DROP TABLE `items`", undefined);
        await queryRunner.query("DROP TABLE `storageLocations`", undefined);
        await queryRunner.query("DROP INDEX `REL_aad9d010f8b7d5f1367e002487` ON `users`", undefined);
        await queryRunner.query("DROP INDEX `IDX_2e7b7debda55e0e7280dc93663` ON `users`", undefined);
        await queryRunner.query("DROP TABLE `users`", undefined);
        await queryRunner.query("DROP TABLE `Transactions`", undefined);
        await queryRunner.query("DROP TABLE `transaction-entry`", undefined);
        await queryRunner.query("DROP TABLE `permission`", undefined);
        await queryRunner.query("DROP INDEX `IDX_1ae515ea2b66b030cf3f5e5ba8` ON `sessions`", undefined);
        await queryRunner.query("DROP TABLE `sessions`", undefined);
    }

}
