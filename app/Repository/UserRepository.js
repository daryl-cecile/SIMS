"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRepository_1 = require("./BaseRepository");
const UserModel_1 = require("../models/UserModel");
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super("user_table", UserModel_1.UserModel);
    }
}
module.exports = new UserRepository();
//# sourceMappingURL=UserRepository.js.map