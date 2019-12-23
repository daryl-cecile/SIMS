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
const StaffModel_1 = require("./StaffModel");
let OrderModel = class OrderModel extends IModel_1.BaseModel {
};
__decorate([
    typeorm_1.Column("varchar", { length: 255, name: "order_reference" }),
    __metadata("design:type", String)
], OrderModel.prototype, "orderReference", void 0);
__decorate([
    typeorm_1.OneToOne(type => StaffModel_1.StaffModel),
    typeorm_1.JoinColumn(),
    __metadata("design:type", StaffModel_1.StaffModel)
], OrderModel.prototype, "employee", void 0);
OrderModel = __decorate([
    typeorm_1.Entity("orders")
], OrderModel);
exports.OrderModel = OrderModel;
//# sourceMappingURL=OrderModel.js.map