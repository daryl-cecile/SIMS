import {UserModel} from "./app/models/UserModel";
import {InventoryModel} from "./app/models/InventoryModel";
import {ItemModel} from "./app/models/ItemModel";
import {NoticeModel} from "./app/models/NoticeModel";
import {OrderModel} from "./app/models/OrderModel";
import {PermissionModel} from "./app/models/PermissionModel";
import {StorageLocationModel} from "./app/models/StorageLocationModel";
import {SessionModel} from "./app/models/SessionModel";
import {TransactionsModel} from "./app/models/TransactionsModel";

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
        InventoryModel,
        ItemModel,
        NoticeModel,
        OrderModel,
        PermissionModel,
        StorageLocationModel,
        UserModel,
        SessionModel,
        TransactionsModel
    ],
    migrationsTableName:'db_migrations',
    migrations: ["orm_migrations/*.js"],
    cli: {
        migrationsDir: "orm_migrations"
    }
};

module.exports = x;