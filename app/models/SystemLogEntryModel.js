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
let SystemLogEntryModel = class SystemLogEntryModel extends IModel_1.BaseModel {
    setExpiry() {
        this.expiry = new Date(Date.now() + 30 * 60000);
    }
};
__decorate([
    typeorm_1.Column("varchar", { length: 255, nullable: true }),
    __metadata("design:type", String)
], SystemLogEntryModel.prototype, "title", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 255 }),
    __metadata("design:type", String)
], SystemLogEntryModel.prototype, "message", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], SystemLogEntryModel.prototype, "extraInformation", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 12, nullable: true, name: 'err-code' }),
    __metadata("design:type", String)
], SystemLogEntryModel.prototype, "errorCode", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SystemLogEntryModel.prototype, "setExpiry", null);
__decorate([
    typeorm_1.Column("varchar"),
    __metadata("design:type", String)
], SystemLogEntryModel.prototype, "reference", void 0);
__decorate([
    typeorm_1.Column("datetime"),
    __metadata("design:type", Date)
], SystemLogEntryModel.prototype, "expiry", void 0);
SystemLogEntryModel = __decorate([
    typeorm_1.Entity("sims-logs")
], SystemLogEntryModel);
exports.SystemLogEntryModel = SystemLogEntryModel;
//# sourceMappingURL=SystemLogEntryModel.js.map