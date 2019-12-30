"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const System_1 = require("./System");
const eventManager = require("../config/GlobalEvents");
const ORMConfig = require("./../../ormconfig");
class DBConnector {
    constructor(info) {
        this._ended = false;
        typeorm_1.createConnection(info).then(conn => {
            this._conn = conn;
            eventManager.trigger("DB_READY");
        }).catch(err => {
            System_1.System.fatal(err, System_1.System.ERRORS.DB_BOOT);
        });
    }
    get connection() {
        if (this._ended)
            return undefined;
        return this._conn;
    }
    ;
    async end() {
        this._ended = true;
        return new Promise(async (resolve) => {
            if (this._conn.isConnected === false) {
                resolve();
            }
            else {
                await this._conn.close();
                resolve();
            }
        });
    }
}
exports.dbConnector = new DBConnector(ORMConfig);
module.exports.default = exports.dbConnector;
//# sourceMappingURL=DBConnection.js.map