import {MigrationInterface, QueryRunner} from "typeorm";

export class addedPreviewImageToItemModel1581350472773 implements MigrationInterface {
    name = 'addedPreviewImageToItemModel1581350472773'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `items` ADD `previewImg` varchar(255) NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `items` DROP COLUMN `previewImg`", undefined);
    }

}
