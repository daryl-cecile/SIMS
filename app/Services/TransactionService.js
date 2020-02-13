"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseService_1 = require("./BaseService");
const System_1 = require("../config/System");
const TransactionsModel_1 = require("../models/TransactionsModel");
const TransactionRepository_1 = require("../Repository/TransactionRepository");
const InventoryRepository_1 = require("../Repository/InventoryRepository");
const ItemRepository_1 = require("../Repository/ItemRepository");
class service extends BaseService_1.BaseService {
    async handlePurchase(transaction, purchasedItems, currentUser) {
        for (const item of purchasedItems) {
            let tempInventory = await InventoryRepository_1.InventoryRepository.findByItemId(item.id);
            tempInventory.quantity -= item.quantity;
            await InventoryRepository_1.InventoryRepository.update(tempInventory);
            transaction.items.push(tempInventory.item);
            await System_1.System.log(`User[${currentUser.identifier}]`, `Issued ${item.quantity} of item[${item.id}]`);
        }
        transaction.transactionType = TransactionsModel_1.TransactionType.PURCHASE;
        await TransactionRepository_1.TransactionRepository.update(transaction);
    }
    async handleRefund(transaction, itemsToRefund) {
        let refundTransaction = new TransactionsModel_1.TransactionsModel();
        refundTransaction.transactionType = TransactionsModel_1.TransactionType.RETURN;
        refundTransaction.items = [];
        for (const item of itemsToRefund) {
            let tempInventory = await InventoryRepository_1.InventoryRepository.findByItemId(item.id);
            tempInventory.quantity += item.quantity;
            await System_1.System.log(`Transaction[${transaction.id}]`, `User[${transaction.userOwner.identifier}] refunded ${item.quantity} of item[${item.id}]`);
            let invItemModel = await ItemRepository_1.ItemRepository.getByItemCode(item.id);
            refundTransaction.items.push(invItemModel);
            await InventoryRepository_1.InventoryRepository.update(tempInventory);
        }
        refundTransaction.userOwner = transaction.userOwner;
        await TransactionRepository_1.TransactionRepository.update(refundTransaction);
    }
    parseRefundItems(req) {
        let itemsToRefund = JSON.parse(req.body['data']['transactions']);
        let transactionsCode = JSON.parse(req.body['data']['transactionCode']);
        return {
            transactionsCode,
            itemsToRefund
        };
    }
    parsePurchasedItems(req) {
        return JSON.parse(req.body['data']);
    }
}
exports.TransactionService = new service();
//# sourceMappingURL=TransactionService.js.map