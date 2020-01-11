"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DBConnection_1 = require("./../config/DBConnection");
class BaseRepository {
    constructor(modelType) {
        this.modelType = modelType;
    }
    get repo() {
        return DBConnection_1.dbConnector.connection.getRepository(this.modelType);
    }
    async save(model) {
        return await DBConnection_1.dbConnector.connection.manager.save(model);
    }
    async update(model) {
        return await this.save(model);
    }
    async delete(model) {
        return await this.repo.remove(model);
    }
    async getAll() {
        return await this.repo.find();
    }
    isConnectionReady() {
        return DBConnection_1.dbConnector.connection !== undefined;
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map