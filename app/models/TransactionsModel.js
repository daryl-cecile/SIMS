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
const ItemModel_1 = require("./ItemModel");
var TransactionType;
(function (TransactionType) {
    TransactionType[TransactionType["PURCHASE"] = 0] = "PURCHASE";
    TransactionType[TransactionType["RETURN"] = 1] = "RETURN";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
let TransactionsModel = class TransactionsModel extends IModel_1.BaseModel {
};
__decorate([
    typeorm_1.ManyToMany(type => ItemModel_1.ItemModel),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], TransactionsModel.prototype, "items", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserModel_1.UserModel, user => user.transactions),
    typeorm_1.JoinColumn(),
    __metadata("design:type", UserModel_1.UserModel)
], TransactionsModel.prototype, "userOwner", void 0);
__decorate([
    typeorm_1.Column("enum", { enum: TransactionType, default: TransactionType.PURCHASE }),
    __metadata("design:type", Number)
], TransactionsModel.prototype, "transactionType", void 0);
TransactionsModel = __decorate([
    typeorm_1.Entity("Transactions")
], TransactionsModel);
exports.TransactionsModel = TransactionsModel;
//# sourceMappingURL=TransactionsModel.js.map