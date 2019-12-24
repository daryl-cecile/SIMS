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
const NoticeModel_1 = require("./NoticeModel");
const InventoryModel_1 = require("./InventoryModel");
let ItemModel = class ItemModel extends IModel_1.BaseModel {
};
__decorate([
    typeorm_1.Column("varchar", { length: 255 }),
    __metadata("design:type", String)
], ItemModel.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], ItemModel.prototype, "description", void 0);
__decorate([
    typeorm_1.ManyToMany(type => NoticeModel_1.NoticeModel),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], ItemModel.prototype, "notices", void 0);
__decorate([
    typeorm_1.Column("int", { default: 1 }),
    __metadata("design:type", Number)
], ItemModel.prototype, "unitCount", void 0);
__decorate([
    typeorm_1.Column("datetime", { nullable: true }),
    __metadata("design:type", Date)
], ItemModel.prototype, "expiry", void 0);
__decorate([
    typeorm_1.OneToOne(type => InventoryModel_1.InventoryModel, inventory => inventory.item, {
        cascade: ['update', 'insert']
    }),
    __metadata("design:type", InventoryModel_1.InventoryModel)
], ItemModel.prototype, "inventoryEntry", void 0);
ItemModel = __decorate([
    typeorm_1.Entity("items")
], ItemModel);
exports.ItemModel = ItemModel;
//# sourceMappingURL=ItemModel.js.map