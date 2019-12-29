"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("./app/models/UserModel");
const InventoryModel_1 = require("./app/models/InventoryModel");
const ItemModel_1 = require("./app/models/ItemModel");
const NoticeModel_1 = require("./app/models/NoticeModel");
const OrderModel_1 = require("./app/models/OrderModel");
const PermissionModel_1 = require("./app/models/PermissionModel");
const StorageLocationModel_1 = require("./app/models/StorageLocationModel");
const SessionModel_1 = require("./app/models/SessionModel");
const TransactionsModel_1 = require("./app/models/TransactionsModel");
const cert = require('./app/config/cert_info');
let x = {
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
        InventoryModel_1.InventoryModel,
        ItemModel_1.ItemModel,
        NoticeModel_1.NoticeModel,
        OrderModel_1.OrderModel,
        PermissionModel_1.PermissionModel,
        StorageLocationModel_1.StorageLocationModel,
        UserModel_1.UserModel,
        SessionModel_1.SessionModel,
        TransactionsModel_1.TransactionsModel
    ],
    migrationsTableName: 'db_migrations',
    migrations: ["orm_migrations/*.js"],
    cli: {
        migrationsDir: "orm_migrations"
    }
};
module.exports = x;
//# sourceMappingURL=ormconfig.js.map