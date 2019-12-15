import {BaseModel, IModel} from "../models/BaseModel";

export class BaseRepository{

    protected readonly db_connection = require('./../config/db_conn');

    constructor(public tableName:string) {}

    async getSingleById<T extends IModel>(id:number):Promise<T>{
        return new Promise<T>((resolve, reject) => {
            let o:IModel = new BaseModel();

            this.db_connection.query(`SELECT * FROM ?? WHERE id = ? LIMIT 1`,[this.tableName,id],function(err, res,fields){
                if (err){
                    reject(err);
                }
                else{
                    Object.keys(res[0]).forEach(columnName => {
                        o[columnName] = res[0][columnName];
                    });
                    resolve(<T>o)
                }
            });

        });
    }

}