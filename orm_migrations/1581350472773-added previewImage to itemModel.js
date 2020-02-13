"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class addedPreviewImageToItemModel1581350472773 {
    constructor() {
        this.name = 'addedPreviewImageToItemModel1581350472773';
    }
    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `items` ADD `previewImg` varchar(255) NULL", undefined);
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `items` DROP COLUMN `previewImg`", undefined);
    }
}
exports.addedPreviewImageToItemModel1581350472773 = addedPreviewImageToItemModel1581350472773;
//# sourceMappingURL=1581350472773-added previewImage to itemModel.js.map