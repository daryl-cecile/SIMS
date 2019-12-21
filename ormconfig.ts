import {TestModel} from "./app/models/TestModel";
import {UserModel} from "./app/models/UserModel";

const cert = require('./app/config/cert_info');

interface IConnectionInfo{
    type: string,
    host: string,
    port: number,
    username: string,
    password: string,
    database?: string,
    ssl: {
        ca: string,
        key: string,
        cert: string
    },
    synchronize: boolean,
    logging: boolean,
    entities: any[],
    migrationsTableName: string,
    migrations: string[],
    cli: {[name:string]:string}
}

let x:IConnectionInfo = {
    type: "mysql",
    host: process.env.SQL_IP,
    port: 3306,
    username: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: "db_main",
    ssl: cert,
    synchronize: false,
    logging: false,
    entities: [
        TestModel,
        UserModel
    ],
    migrationsTableName:'db_migrations',
    migrations: ["migration/*.js"],
    cli: {
        migrationsDir: "orm_migrations"
    }
};

module.exports = x;