import {IModel} from "../models/IModel";

export class BaseRepository<T extends IModel>{

    protected readonly dbConnector = require('../config/DBConnection');

    constructor(public tableName:string, public modelType:{new(): T}) { }

    async save(model:T):Promise<T>{
        return await this.dbConnector.connection.manager.save(model);
    }


}