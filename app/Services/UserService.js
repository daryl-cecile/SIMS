"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseService_1 = require("./BaseService");
const UserRepository_1 = require("../Repository/UserRepository");
class service extends BaseService_1.BaseService {
    async isUserStaffMember(userAccount) {
        let staffPermissions = ["STAFF", "MANAGE", "ADMIN"];
        for (let i = 0; i < userAccount.permissions.length; i++) {
            if (staffPermissions.indexOf(userAccount.permissions[i].name) > -1) {
                return true;
            }
        }
        return false;
    }
    async hasPermission(userAccount, permissionName) {
        for (const perm of userAccount.permissions) {
            if (perm.name === permissionName) {
                return true;
            }
        }
        return false;
    }
    async getAllCustomers() {
        let users = await UserRepository_1.UserRepository.getAll();
        let finalList = [];
        for (const u of users) {
            if ((await this.isUserStaffMember(u)) === false) {
                finalList.push(u);
            }
        }
        return finalList;
    }
    async getAllStaffMembers() {
        let users = await UserRepository_1.UserRepository.getAll();
        let finalList = [];
        for (const u of users) {
            if (await this.isUserStaffMember(u)) {
                finalList.push(u);
            }
        }
        return finalList;
    }
}
exports.UserService = new service();
//# sourceMappingURL=UserService.js.map