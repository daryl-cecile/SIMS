import {MigrationInterface, QueryRunner} from "typeorm";

export class addedExtraFeildInSysLog1579873399736 implements MigrationInterface {
    name = 'addedExtraFeildInSysLog1579873399736'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `sims-logs` ADD `extraInformation` text NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `sims-logs` DROP COLUMN `extraInformation`", undefined);
    }

}
