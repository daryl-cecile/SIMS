import {BaseRepository} from "./BaseRepository";
import {TestModel} from "../models/TestModel";
import {FindManyOptions} from "typeorm/find-options/FindManyOptions";

class TestRepository extends BaseRepository<TestModel>{

    constructor() {
        super("test_table", TestModel);
    }

    async getSingleById(id:number):Promise<TestModel>{
        let repo = this.dbConnector.connection.getRepository(this.modelType);
        let res = await repo.find({
            where: {id} ,
            relations:['user']
        });
        return res[0];
    }

    async getAll():Promise<TestModel[]>{
        let repo = this.dbConnector.connection.getRepository(this.modelType);
        return await repo.find({
            relations: ['user']
        });
    }

    async get(opt:FindManyOptions):Promise<TestModel[]>{
        let options:FindManyOptions = Object.assign({
            relations: ['user']
        }, opt);

        let repo = this.dbConnector.connection.getRepository(this.modelType);
        return await repo.find(options);
    }

    async deleteById(id:string){
        await this.dbConnector.connection
            .createQueryBuilder()
            .delete()
            .from(this.modelType)
            .where("id = :id", { id: id })
            .execute();
    }

    async delete(...models:TestModel[]){
        await this.dbConnector.connection.getRepository(this.modelType).remove(models);
    }

}

module.exports = new TestRepository();