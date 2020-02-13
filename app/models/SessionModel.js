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
const typeorm_1 = require("typeorm");
const IModel_1 = require("./IModel");
const UserModel_1 = require("./UserModel");
let SessionModel = class SessionModel extends IModel_1.BaseModel {
    get IsValid() {
        return (this.invalid === false && (Date.now() < this.expiry.getTime() + (30 * 60 * 1000)));
    }
};
__decorate([
    typeorm_1.Column("varchar", { length: 255, unique: true }),
    __metadata("design:type", String)
], SessionModel.prototype, "sessionKey", void 0);
__decorate([
    typeorm_1.Column("datetime"),
    __metadata("design:type", Date)
], SessionModel.prototype, "expiry", void 0);
__decorate([
    typeorm_1.Column("bool", { default: false }),
    __metadata("design:type", Boolean)
], SessionModel.prototype, "invalid", void 0);
__decorate([
    typeorm_1.OneToOne(type => UserModel_1.UserModel, user => user.currentSession),
    __metadata("design:type", UserModel_1.UserModel)
], SessionModel.prototype, "owner", void 0);
SessionModel = __decorate([
    typeorm_1.Entity("sessions")
], SessionModel);
exports.SessionModel = SessionModel;
//# sourceMappingURL=SessionModel.js.map