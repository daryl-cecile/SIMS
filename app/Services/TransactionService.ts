import {BaseService} from "./BaseService";
import {Items} from "../payloads/ItemList";
import {System} from "../config/System";
import {UserModel} from "../models/UserModel";
import {TransactionsModel} from "../models/TransactionsModel";
import {TransactionRepository} from "../Repository/TransactionRepository";
import {InventoryRepository} from "../Repository/InventoryRepository";

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
            await System.log("User[" + currentUser.identifier + "]", "Issued " + item.quantity + " of item["
            + item.id +"]");

        }
        await TransactionRepository.update(transaction);
    }
    async handleRefund(transaction:TransactionsModel, itemsToRefund:Items[]) {
        for (const item of itemsToRefund) {
            let tempInventory = await InventoryRepository.findByItemId(item.id);
            tempInventory.quantity += item.quantity;
            await System.log("Transaction[" + transaction.id + "]", "User[" +
                transaction.userOwner.identifier+"] refunded " + item.quantity + " of item["+
                item.id+"]");

            await InventoryRepository.update(tempInventory);
        }
    }
    async parseRefundItems(req) {
        let itemsToRefund:Items[] = JSON.parse(req.body['data']['transactions']);
        let transactionsCode = JSON.parse(req.body['data']['transactionCode']);
        return {
            transactionsCode,
            itemsToRefund
        }
    }
    async parsePurchasedItems(req) {
        let itemsPurchased:Items[] = JSON.parse(req.body['data']);
        return itemsPurchased;
    }
}
export const TransactionService = new service();