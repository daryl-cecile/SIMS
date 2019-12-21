"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRepository_1 = require("./BaseRepository");
const TestModel_1 = require("../models/TestModel");
class TestRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super("test_table", TestModel_1.TestModel);
    }
    async getSingleById(id) {
        let repo = this.dbConnector.connection.getRepository(this.modelType);
        let res = await repo.find({
            where: { id },
            relations: ['user']
        });
        return res[0];
    }
    async getAll() {
        let repo = this.dbConnector.connection.getRepository(this.modelType);
        return await repo.find({
            relations: ['user']
        });
    }
    async get(opt) {
        let options = Object.assign({
            relations: ['user']
        }, opt);
        let repo = this.dbConnector.connection.getRepository(this.modelType);
        return await repo.find(options);
    }
    async deleteById(id) {
        await this.dbConnector.connection
            .createQueryBuilder()
            .delete()
            .from(this.modelType)
            .where("id = :id", { id: id })
            .execute();
    }
    async delete(...models) {
        await this.dbConnector.connection.getRepository(this.modelType).remove(models);
    }
}
module.exports = new TestRepository();
//# sourceMappingURL=TestRepository.js.map