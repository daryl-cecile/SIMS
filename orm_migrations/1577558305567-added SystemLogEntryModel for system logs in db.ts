import {MigrationInterface, QueryRunner} from "typeorm";

export class addedSystemLogEntryModelForSystemLogsInDb1577558305567 implements MigrationInterface {
    name = 'addedSystemLogEntryModelForSystemLogsInDb1577558305567'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `sims-logs` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(255) NULL, `message` varchar(255) NOT NULL, `err-code` varchar(12) NULL, `reference` varchar(255) NOT NULL, `expiry` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `sims-logs`", undefined);
    }

}
