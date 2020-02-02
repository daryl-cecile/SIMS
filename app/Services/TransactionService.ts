import {BaseService} from "./BaseService";
import {Items} from "../payloads/ItemList";
import {System} from "../config/System";
import {UserModel} from "../models/UserModel";
import {TransactionsModel, TransactionType} from "../models/TransactionsModel";
import {TransactionRepository} from "../Repository/TransactionRepository";
import {InventoryRepository} from "../Repository/InventoryRepository";
import {ItemRepository} from "../Repository/ItemRepository";

class service extends BaseService {

    async handlePurchase(transaction:TransactionsModel, purchasedItems:Items[], currentUser:UserModel) {
        for (const item of purchasedItems) {
            // Retrieve Inventory
            let tempInventory = await InventoryRepository.findByItemId(item.id);
            // Update Inventory
            tempInventory.quantity -= item.quantity;
            await InventoryRepository.update(tempInventory);

            // Add item to transaction
            transaction.items.push(tempInventory.item);
            await System.log(`User[${currentUser.identifier}]`, `Issued ${item.quantity} of item[${item.id}]`);

        }
        transaction.transactionType = TransactionType.PURCHASE;
        await TransactionRepository.update(transaction);
    }

    async handleRefund(transaction:TransactionsModel, itemsToRefund:Items[]) {
        let refundTransaction = new TransactionsModel();
        refundTransaction.transactionType = TransactionType.RETURN;
        refundTransaction.items = [];

        for (const item of itemsToRefund) {
            let tempInventory = await InventoryRepository.findByItemId(item.id);
            tempInventory.quantity += item.quantity;
            await System.log(`Transaction[${transaction.id}]`, `User[${transaction.userOwner.identifier}] refunded ${item.quantity} of item[${item.id}]`);

            let invItemModel = await ItemRepository.getByItemCode(item.id);
            refundTransaction.items.push(invItemModel); // only items that need returning
            await InventoryRepository.update(tempInventory);
        }
        refundTransaction.userOwner = transaction.userOwner;
        await TransactionRepository.update(refundTransaction); // save refund transaction
    }

    parseRefundItems(req) {
        let itemsToRefund:Items[] = JSON.parse(req.body['data']['transactions']);
        let transactionsCode = JSON.parse(req.body['data']['transactionCode']);
        return {
            transactionsCode,
            itemsToRefund
        }
    }

    parsePurchasedItems(req):Items[] {
        return JSON.parse(req.body['data']);
    }
}
export const TransactionService = new service();