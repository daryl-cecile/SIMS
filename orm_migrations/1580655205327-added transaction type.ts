import {MigrationInterface, QueryRunner} from "typeorm";

export class addedTransactionType1580655205327 implements MigrationInterface {
    name = 'addedTransactionType1580655205327'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `Transactions` ADD `transactionType` enum ('0', '1') NOT NULL DEFAULT '0'", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `Transactions` DROP COLUMN `transactionType`", undefined);
    }

}
