"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const System_1 = require("./System");
const eventManager = require("../config/GlobalEvents");
const ORMConfig = require("./../../ormconfig");
class DBConnector {
    constructor(info) {
        this._conn = undefined;
        typeorm_1.createConnection(info).then(conn => {
            this._conn = conn;
            eventManager.trigger("DB_READY");
        }).catch(err => {
            System_1.System.fatal(err, System_1.System.ERRORS.DB_BOOT);
        });
    }
    get connection() {
        if (this._conn && this._conn.isConnected === false)
            return undefined;
        return this._conn;
    }
    ;
}
exports.dbConnector = new DBConnector(ORMConfig);
module.exports.default = exports.dbConnector;
//# sourceMappingURL=DBConnection.js.map