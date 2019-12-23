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
const AuthModel_1 = require("./AuthModel");
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
    typeorm_1.ManyToMany(type => AuthModel_1.AuthModel),
    typeorm_1.JoinTable(),
    __metadata("design:type", AuthModel_1.AuthModel)
], UserModel.prototype, "authentication", void 0);
UserModel = __decorate([
    typeorm_1.Entity("users")
], UserModel);
exports.UserModel = UserModel;
//# sourceMappingURL=UserModel.js.map