import {MigrationInterface, QueryRunner} from "typeorm";

export class addedNewSessionTable1577103520295 implements MigrationInterface {
    name = 'addedNewSessionTable1577103520295'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `auth` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `firstName` varchar(255) NULL, `lastName` varchar(255) NULL, `email` varchar(255) NULL, `identifier` varchar(8) NOT NULL, UNIQUE INDEX `IDX_2e7b7debda55e0e7280dc93663` (`identifier`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `notices` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `items` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `description` text NOT NULL, `unitCount` int NOT NULL DEFAULT 1, `expiry` datetime NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `storageLocations` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `location` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `stocks` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `quantity` int NOT NULL, `itemId` int NULL, `storageLocationId` int NULL, UNIQUE INDEX `REL_f6d74b043f484539546c442a7e` (`itemId`), UNIQUE INDEX `REL_0815f14dae1eb863ee1f54b465` (`storageLocationId`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `permission` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `sessions` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `sessionKey` varchar(255) NOT NULL, `expiry` datetime NOT NULL, `invalid` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX `IDX_1ae515ea2b66b030cf3f5e5ba8` (`sessionKey`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `staffs` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `firstName` varchar(255) NULL, `lastName` varchar(255) NULL, `email` varchar(255) NULL, `identifier` varchar(8) NOT NULL, `password_hash` varchar(255) NOT NULL, `currentSessionId` int NULL, UNIQUE INDEX `IDX_1382303f5d3ee6de34c9d32bc9` (`identifier`), UNIQUE INDEX `REL_7d69c393336f62e89da4c083ee` (`currentSessionId`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `orders` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `order_reference` varchar(255) NOT NULL, `employeeId` int NULL, UNIQUE INDEX `REL_59fadea46c0451b6663017f4c5` (`employeeId`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `users_authentication_auth` (`usersId` int NOT NULL, `authId` int NOT NULL, INDEX `IDX_7a22b54718dc2420af9a610045` (`usersId`), INDEX `IDX_582bfedd627e7645248eb6f843` (`authId`), PRIMARY KEY (`usersId`, `authId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `items_notices_notices` (`itemsId` int NOT NULL, `noticesId` int NOT NULL, INDEX `IDX_2e2aeb3e45fe778f7a96b33ba5` (`itemsId`), INDEX `IDX_8829d658e2283d936378e209e5` (`noticesId`), PRIMARY KEY (`itemsId`, `noticesId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `staffs_permissions_permission` (`staffsId` int NOT NULL, `permissionId` int NOT NULL, INDEX `IDX_f00391a0e57386456681b80fb4` (`staffsId`), INDEX `IDX_1bf26fa5d1a6a0e3738417868e` (`permissionId`), PRIMARY KEY (`staffsId`, `permissionId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `stocks` ADD CONSTRAINT `FK_f6d74b043f484539546c442a7ef` FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `stocks` ADD CONSTRAINT `FK_0815f14dae1eb863ee1f54b465e` FOREIGN KEY (`storageLocationId`) REFERENCES `storageLocations`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `staffs` ADD CONSTRAINT `FK_7d69c393336f62e89da4c083ee1` FOREIGN KEY (`currentSessionId`) REFERENCES `sessions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `orders` ADD CONSTRAINT `FK_59fadea46c0451b6663017f4c51` FOREIGN KEY (`employeeId`) REFERENCES `staffs`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `users_authentication_auth` ADD CONSTRAINT `FK_7a22b54718dc2420af9a610045a` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `users_authentication_auth` ADD CONSTRAINT `FK_582bfedd627e7645248eb6f8435` FOREIGN KEY (`authId`) REFERENCES `auth`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `items_notices_notices` ADD CONSTRAINT `FK_2e2aeb3e45fe778f7a96b33ba5a` FOREIGN KEY (`itemsId`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `items_notices_notices` ADD CONSTRAINT `FK_8829d658e2283d936378e209e5d` FOREIGN KEY (`noticesId`) REFERENCES `notices`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `staffs_permissions_permission` ADD CONSTRAINT `FK_f00391a0e57386456681b80fb4f` FOREIGN KEY (`staffsId`) REFERENCES `staffs`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `staffs_permissions_permission` ADD CONSTRAINT `FK_1bf26fa5d1a6a0e3738417868e9` FOREIGN KEY (`permissionId`) REFERENCES `permission`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `staffs_permissions_permission` DROP FOREIGN KEY `FK_1bf26fa5d1a6a0e3738417868e9`", undefined);
        await queryRunner.query("ALTER TABLE `staffs_permissions_permission` DROP FOREIGN KEY `FK_f00391a0e57386456681b80fb4f`", undefined);
        await queryRunner.query("ALTER TABLE `items_notices_notices` DROP FOREIGN KEY `FK_8829d658e2283d936378e209e5d`", undefined);
        await queryRunner.query("ALTER TABLE `items_notices_notices` DROP FOREIGN KEY `FK_2e2aeb3e45fe778f7a96b33ba5a`", undefined);
        await queryRunner.query("ALTER TABLE `users_authentication_auth` DROP FOREIGN KEY `FK_582bfedd627e7645248eb6f8435`", undefined);
        await queryRunner.query("ALTER TABLE `users_authentication_auth` DROP FOREIGN KEY `FK_7a22b54718dc2420af9a610045a`", undefined);
        await queryRunner.query("ALTER TABLE `orders` DROP FOREIGN KEY `FK_59fadea46c0451b6663017f4c51`", undefined);
        await queryRunner.query("ALTER TABLE `staffs` DROP FOREIGN KEY `FK_7d69c393336f62e89da4c083ee1`", undefined);
        await queryRunner.query("ALTER TABLE `stocks` DROP FOREIGN KEY `FK_0815f14dae1eb863ee1f54b465e`", undefined);
        await queryRunner.query("ALTER TABLE `stocks` DROP FOREIGN KEY `FK_f6d74b043f484539546c442a7ef`", undefined);
        await queryRunner.query("DROP INDEX `IDX_1bf26fa5d1a6a0e3738417868e` ON `staffs_permissions_permission`", undefined);
        await queryRunner.query("DROP INDEX `IDX_f00391a0e57386456681b80fb4` ON `staffs_permissions_permission`", undefined);
        await queryRunner.query("DROP TABLE `staffs_permissions_permission`", undefined);
        await queryRunner.query("DROP INDEX `IDX_8829d658e2283d936378e209e5` ON `items_notices_notices`", undefined);
        await queryRunner.query("DROP INDEX `IDX_2e2aeb3e45fe778f7a96b33ba5` ON `items_notices_notices`", undefined);
        await queryRunner.query("DROP TABLE `items_notices_notices`", undefined);
        await queryRunner.query("DROP INDEX `IDX_582bfedd627e7645248eb6f843` ON `users_authentication_auth`", undefined);
        await queryRunner.query("DROP INDEX `IDX_7a22b54718dc2420af9a610045` ON `users_authentication_auth`", undefined);
        await queryRunner.query("DROP TABLE `users_authentication_auth`", undefined);
        await queryRunner.query("DROP INDEX `REL_59fadea46c0451b6663017f4c5` ON `orders`", undefined);
        await queryRunner.query("DROP TABLE `orders`", undefined);
        await queryRunner.query("DROP INDEX `REL_7d69c393336f62e89da4c083ee` ON `staffs`", undefined);
        await queryRunner.query("DROP INDEX `IDX_1382303f5d3ee6de34c9d32bc9` ON `staffs`", undefined);
        await queryRunner.query("DROP TABLE `staffs`", undefined);
        await queryRunner.query("DROP INDEX `IDX_1ae515ea2b66b030cf3f5e5ba8` ON `sessions`", undefined);
        await queryRunner.query("DROP TABLE `sessions`", undefined);
        await queryRunner.query("DROP TABLE `permission`", undefined);
        await queryRunner.query("DROP INDEX `REL_0815f14dae1eb863ee1f54b465` ON `stocks`", undefined);
        await queryRunner.query("DROP INDEX `REL_f6d74b043f484539546c442a7e` ON `stocks`", undefined);
        await queryRunner.query("DROP TABLE `stocks`", undefined);
        await queryRunner.query("DROP TABLE `storageLocations`", undefined);
        await queryRunner.query("DROP TABLE `items`", undefined);
        await queryRunner.query("DROP TABLE `notices`", undefined);
        await queryRunner.query("DROP INDEX `IDX_2e7b7debda55e0e7280dc93663` ON `users`", undefined);
        await queryRunner.query("DROP TABLE `users`", undefined);
        await queryRunner.query("DROP TABLE `auth`", undefined);
    }

}
