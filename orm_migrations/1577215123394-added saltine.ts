import {MigrationInterface, QueryRunner} from "typeorm";

export class addedSaltine1577215123394 implements MigrationInterface {
    name = 'addedSaltine1577215123394'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `users` ADD `saltine` varchar(255) NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `saltine`", undefined);
    }

}
