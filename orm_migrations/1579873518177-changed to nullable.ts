import {MigrationInterface, QueryRunner} from "typeorm";

export class changedToNullable1579873518177 implements MigrationInterface {
    name = 'changedToNullable1579873518177'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `sims-logs` CHANGE `extraInformation` `extraInformation` text NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `sims-logs` CHANGE `extraInformation` `extraInformation` text NOT NULL", undefined);
    }

}
