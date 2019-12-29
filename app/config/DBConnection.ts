import "reflect-metadata";
import {Connection, createConnection} from "typeorm";
import {System} from "./System";

const eventManager = require("../config/GlobalEvents");
const ORMConfig = require("./../../ormconfig");

class DBConnector {
    private _conn:Connection;
    constructor(info) {

        createConnection(info).then(conn => {
            this._conn = conn;
            eventManager.trigger("DB_READY");
        }).catch(err => {
            System.err(err, System.ERRORS.DB_BOOT);
            throw err;
        });

    }

    public get connection():Connection{
        return this._conn;
    };

    async end(){
        return this.connection.close();
    }
}

module.exports = new DBConnector( ORMConfig );