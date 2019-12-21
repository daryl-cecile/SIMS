"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRepository {
    constructor(tableName, modelType) {
        this.tableName = tableName;
        this.modelType = modelType;
        this.dbConnector = require('../config/DBConnection');
    }
    async save(model) {
        return await this.dbConnector.connection.manager.save(model);
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map