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
const ItemModel_1 = require("./ItemModel");
const StorageLocationModel_1 = require("./StorageLocationModel");
let InventoryModel = class InventoryModel extends IModel_1.BaseModel {
};
__decorate([
    typeorm_1.OneToOne(type => ItemModel_1.ItemModel, item => item.inventoryEntry),
    typeorm_1.JoinColumn(),
    __metadata("design:type", ItemModel_1.ItemModel)
], InventoryModel.prototype, "item", void 0);
__decorate([
    typeorm_1.Column("int"),
    __metadata("design:type", Number)
], InventoryModel.prototype, "quantity", void 0);
__decorate([
    typeorm_1.OneToOne(type => StorageLocationModel_1.StorageLocationModel),
    typeorm_1.JoinColumn(),
    __metadata("design:type", StorageLocationModel_1.StorageLocationModel)
], InventoryModel.prototype, "storageLocation", void 0);
InventoryModel = __decorate([
    typeorm_1.Entity("stocks")
], InventoryModel);
exports.InventoryModel = InventoryModel;
//# sourceMappingURL=InventoryModel.js.map