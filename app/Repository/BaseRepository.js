"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("../models/BaseModel");
class BaseRepository {
    constructor(tableName) {
        this.tableName = tableName;
        this.db_connection = require('./../config/db_conn');
    }
    async getSingleById(id) {
        return new Promise((resolve, reject) => {
            let o = new BaseModel_1.BaseModel();
            this.db_connection.query(`SELECT * FROM ?? WHERE id = ? LIMIT 1`, [this.tableName, id], function (err, res, fields) {
                if (err) {
                    reject(err);
                }
                else {
                    Object.keys(res[0]).forEach(columnName => {
                        o[columnName] = res[0][columnName];
                    });
                    resolve(o);
                }
            });
        });
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map