import "reflect-metadata";
import {Connection, createConnection} from "typeorm";
import {System} from "./System";

const eventManager = require("../config/GlobalEvents");
const ORMConfig = require("./../../ormconfig");

class DBConnector {
    private _conn:Connection;
    private _ended:boolean = false;
    constructor(info) {

        createConnection(info).then(conn => {
            this._conn = conn;
            eventManager.trigger("DB_READY");
        }).catch(err => {
            System.fatal(err, System.ERRORS.DB_BOOT);
        });

    }

    public get connection():Connection{
        if (this._ended) return undefined;
        return this._conn;
    };

    async end(){
        this._ended = true;
        return this._conn.close();
    }
}

module.exports = new DBConnector( ORMConfig );