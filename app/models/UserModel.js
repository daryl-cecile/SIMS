"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const IModel_1 = require("./IModel");
const typeorm_1 = require("typeorm");
const SessionModel_1 = require("./SessionModel");
const PermissionModel_1 = require("./PermissionModel");
const TransactionsModel_1 = require("./TransactionsModel");
let UserModel = class UserModel extends IModel_1.BaseModel {
};
__decorate([
    typeorm_1.Column("varchar", { length: 255, nullable: true }),
    __metadata("design:type", String)
], UserModel.prototype, "firstName", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, nullable: true }),
    __metadata("design:type", String)
], UserModel.prototype, "lastName", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, nullable: true }),
    __metadata("design:type", String)
], UserModel.prototype, "email", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 8, unique: true }),
    __metadata("design:type", String)
], UserModel.prototype, "identifier", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, nullable: true, name: "password_hash" }),
    IModel_1.jsonIgnore(),
    __metadata("design:type", String)
], UserModel.prototype, "passHash", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255, nullable: true, name: "saltine" }),
    IModel_1.jsonIgnore(),
    __metadata("design:type", String)
], UserModel.prototype, "saltine", void 0);
__decorate([
    typeorm_1.OneToOne(type => SessionModel_1.SessionModel, session => session.owner, {
        nullable: true,
        cascade: ['insert', 'update', 'remove'],
        eager: true
    }),
    typeorm_1.JoinColumn(),
    IModel_1.jsonIgnore(),
    __metadata("design:type", SessionModel_1.SessionModel)
], UserModel.prototype, "currentSession", void 0);
__decorate([
    typeorm_1.ManyToMany(type => PermissionModel_1.PermissionModel, {
        eager: true
    }),
    typeorm_1.JoinTable(),
    IModel_1.jsonIgnore(),
    __metadata("design:type", Array)
], UserModel.prototype, "permissions", void 0);
__decorate([
    typeorm_1.OneToMany(type => TransactionsModel_1.TransactionsModel, transaction => transaction.userOwner, {
        cascade: true,
        eager: true
    }),
    __metadata("design:type", Array)
], UserModel.prototype, "transactions", void 0);
UserModel = __decorate([
    typeorm_1.Entity("users")
], UserModel);
exports.UserModel = UserModel;
//# sourceMappingURL=UserModel.js.map