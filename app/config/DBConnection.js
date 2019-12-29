"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const System_1 = require("./System");
const eventManager = require("../config/GlobalEvents");
const ORMConfig = require("./../../ormconfig");
class DBConnector {
    constructor(info) {
        typeorm_1.createConnection(info).then(conn => {
            this._conn = conn;
            eventManager.trigger("DB_READY");
        }).catch(err => {
            System_1.System.err(err, System_1.System.ERRORS.DB_BOOT);
            throw err;
        });
    }
    get connection() {
        return this._conn;
    }
    ;
    async end() {
        return this.connection.close();
    }
}
module.exports = new DBConnector(ORMConfig);
//# sourceMappingURL=DBConnection.js.map