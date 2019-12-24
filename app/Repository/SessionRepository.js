"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRepository_1 = require("./BaseRepository");
const SessionModel_1 = require("../models/SessionModel");
class repo extends BaseRepository_1.BaseRepository {
    constructor() {
        super(SessionModel_1.SessionModel);
    }
    async getBySessionKey(sessionKey) {
        return await this.repo.findOne({
            where: { sessionKey },
            relations: ['owner']
        });
    }
}
exports.SessionRepository = new repo();
//# sourceMappingURL=SessionRepository.js.map