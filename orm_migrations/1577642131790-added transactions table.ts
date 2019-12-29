import {MigrationInterface, QueryRunner} from "typeorm";

export class addedTransactionsTable1577642131790 implements MigrationInterface {
    name = 'addedTransactionsTable1577642131790'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `Transactions` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userOwnerId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `transactions_items_items` (`transactionsId` int NOT NULL, `itemsId` int NOT NULL, INDEX `IDX_dab628420c0c50aa28272ac83a` (`transactionsId`), INDEX `IDX_07ef28b36b79d9880c973be126` (`itemsId`), PRIMARY KEY (`transactionsId`, `itemsId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `Transactions` ADD CONSTRAINT `FK_f2a658c1c81c171c3f9f2531d27` FOREIGN KEY (`userOwnerId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `transactions_items_items` ADD CONSTRAINT `FK_dab628420c0c50aa28272ac83a0` FOREIGN KEY (`transactionsId`) REFERENCES `Transactions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `transactions_items_items` ADD CONSTRAINT `FK_07ef28b36b79d9880c973be126f` FOREIGN KEY (`itemsId`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `transactions_items_items` DROP FOREIGN KEY `FK_07ef28b36b79d9880c973be126f`", undefined);
        await queryRunner.query("ALTER TABLE `transactions_items_items` DROP FOREIGN KEY `FK_dab628420c0c50aa28272ac83a0`", undefined);
        await queryRunner.query("ALTER TABLE `Transactions` DROP FOREIGN KEY `FK_f2a658c1c81c171c3f9f2531d27`", undefined);
        await queryRunner.query("DROP INDEX `IDX_07ef28b36b79d9880c973be126` ON `transactions_items_items`", undefined);
        await queryRunner.query("DROP INDEX `IDX_dab628420c0c50aa28272ac83a` ON `transactions_items_items`", undefined);
        await queryRunner.query("DROP TABLE `transactions_items_items`", undefined);
        await queryRunner.query("DROP TABLE `Transactions`", undefined);
    }

}
