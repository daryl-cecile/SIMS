import {Connection, createConnection, getConnection} from "typeorm";
import {System} from "./System";

const eventManager = require("../config/GlobalEvents");
const ORMConfig = require("./../../ormconfig");

class DBConnector {
    private _conn:Connection = undefined;
    constructor(info) {

        createConnection(info).then(conn => {
            this._conn = conn;
            eventManager.trigger("DB_READY");
        }).catch(err => {
            System.fatal(err, System.ERRORS.DB_BOOT);
        });

    }

    public get connection():Connection{
        if (this._conn && this._conn.isConnected === false) return undefined;
        return this._conn;
    };

    public end():Promise<void>{
        return getConnection().driver.disconnect();
    }
}

export const dbConnector = new DBConnector( ORMConfig );
module.exports.default = dbConnector;