import {IModel} from "../models/IModel";
import {Repository} from "typeorm";

export class BaseRepository<T extends IModel>{

    protected readonly db = require('../config/DBConnection');

    protected get repo():Repository<T>{
        return this.db.connection.getRepository(this.modelType);
    }

    constructor(public modelType:{new(): T}) { }

    async save(model:T):Promise<T>{
        return await this.db.connection.manager.save(model);
    }

    async update(model:T):Promise<T>{
        return await this.save(model);
    }

    async getAll():Promise<T[]>{
        return await this.repo.find();
    }

    isConnectionReady():boolean{
        return this.db.connection !== undefined;
    }

}