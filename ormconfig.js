"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestModel_1 = require("./app/models/TestModel");
const UserModel_1 = require("./app/models/UserModel");
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
        TestModel_1.TestModel,
        UserModel_1.UserModel
    ],
    migrationsTableName: 'db_migrations',
    migrations: ["migration/*.js"],
    cli: {
        migrationsDir: "orm_migrations"
    }
};
module.exports = x;
//# sourceMappingURL=ormconfig.js.map