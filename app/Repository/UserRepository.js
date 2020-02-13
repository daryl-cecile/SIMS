"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRepository_1 = require("./BaseRepository");
const UserModel_1 = require("../models/UserModel");
class repo extends BaseRepository_1.BaseRepository {
    constructor() {
        super(UserModel_1.UserModel);
    }
    async getUserByIdentifierOrEmail(identifierOrEmail) {
        return await this.repo.findOne({
            where: [
                { identifier: identifierOrEmail },
                { email: identifierOrEmail }
            ]
        });
    }
    async getUserByIdentifier(identifier) {
        return await this.repo.findOne({
            where: { identifier }
        });
    }
}
exports.UserRepository = new repo();
//# sourceMappingURL=UserRepository.js.map