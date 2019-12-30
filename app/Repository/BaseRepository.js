"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRepository {
    constructor(modelType) {
        this.modelType = modelType;
        this.db = require('../config/DBConnection');
    }
    get repo() {
        return this.db.connection.getRepository(this.modelType);
    }
    async save(model) {
        return await this.db.connection.manager.save(model);
    }
    async update(model) {
        return await this.save(model);
    }
    async getAll() {
        return await this.repo.find();
    }
    isConnectionReady() {
        return this.db.connection !== undefined;
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map