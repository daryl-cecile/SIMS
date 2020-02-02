import {BaseService} from "./BaseService";
import {Items} from "../payloads/ItemList";
import {System} from "../config/System";
import {ItemRepository} from "../Repository/ItemRepository";
import {UserModel} from "../models/UserModel";
import {TransactionsModel} from "../models/TransactionsModel";
import {TransactionRepository} from "../Repository/TransactionRepository";

class service extends BaseService {

    async handlePurchase(transaction:TransactionsModel, purchasedItems:Items[], currentUser:UserModel) {
        for (const item of purchasedItems) {
            // Retrieve Item
            let tempItem = await ItemRepository.getByItemCode(item.id);
            // Update Item
            tempItem.unitCount -= item.quantity;
            await ItemRepository.update(tempItem);

            // Add item to transaction
            transaction.items.push(tempItem);
            await System.log("User[" + currentUser.identifier + "]", "Issued " + item.quantity + " of item["
            + item.id +"]");

        }
        await TransactionRepository.update(transaction);
    }
    async handleRefund(transaction:TransactionsModel, itemsToRefund:Items[]) {
        for (const item of itemsToRefund) {
            //Find element index
            let tempIndex = transaction.items.findIndex(element => element.id = item.id);

            // Add returned items to unit count
            transaction.items[tempIndex].unitCount += item.quantity;
            await System.log("Transaction[" + transaction.id + "]", "User[" +
                transaction.userOwner.identifier+"] refunded " + item.quantity + " of item["+
                item.id+"]");
        }
        await TransactionRepository.update(transaction);
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