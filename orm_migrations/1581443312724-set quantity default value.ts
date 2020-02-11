import {MigrationInterface, QueryRunner} from "typeorm";

export class setQuantityDefaultValue1581443312724 implements MigrationInterface {
    name = 'setQuantityDefaultValue1581443312724'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `items` CHANGE `quantity` `quantity` int NOT NULL DEFAULT 1", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `items` CHANGE `quantity` `quantity` int NOT NULL", undefined);
    }

}
