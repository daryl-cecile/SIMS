"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRepository_1 = require("./BaseRepository");
const PermissionModel_1 = require("../models/PermissionModel");
class repo extends BaseRepository_1.BaseRepository {
    constructor() {
        super(PermissionModel_1.PermissionModel);
    }
    async getPermissionByName(permissionName) {
        return await this.repo.findOne({
            where: { name: permissionName }
        });
    }
}
exports.PermissionRepository = new repo();
//# sourceMappingURL=PermissionRepository.js.map