import {BaseService} from "./BaseService";
import {Items} from "../payloads/ItemList";
import {System} from "../config/System";
import {UserModel} from "../models/UserModel";
import {TransactionsModel, TransactionType} from "../models/TransactionsModel";
import {TransactionRepository} from "../Repository/TransactionRepository";
import {ItemRepository} from "../Repository/ItemRepository";
import {OrderModel} from "../models/OrderModel";

class service extends BaseService {

    async handlePurchase(transaction:TransactionsModel, purchasedItems:Items[], currentUser:UserModel) {
        for (const item of purchasedItems) {

            let tempItem = await ItemRepository.getByItemCode(item.id);

            tempItem.unitCount -= item.unitCount;
            await ItemRepository.update(tempItem);

            // Add item to transaction
            let tempEntry = new OrderModel();
            tempEntry.itemId = item.id;
            tempEntry.stock = item.unitCount;
            if (!transaction.entries) transaction.entries = [];
            transaction.entries.push(tempEntry);

            await System.log(`User[${currentUser.identifier}]`, `Issued ${item.unitCount} of item[${item.id}]`);

        }
        transaction.transactionType = TransactionType.PURCHASE;
        return await TransactionRepository.update(transaction);
    }

    async handleRefund(transaction:TransactionsModel, itemsToRefund:Items[]) {
        let refundTransaction = new TransactionsModel();
        refundTransaction.transactionType = TransactionType.RETURN;
        refundTransaction.entries = [];

        for (const item of itemsToRefund) {
            let tempItem = await ItemRepository.getByItemCode(item.id);
            tempItem.unitCount += item.unitCount;
            await ItemRepository.update(tempItem);

            await System.log(`Transaction[${transaction.id}]`, `User[${transaction.userOwner.identifier}] refunded ${item.unitCount} of item[${item.id}]`);

            let tempEntry = new OrderModel();
            tempEntry.itemId = item.id;
            tempEntry.stock = item.unitCount;
            if (!refundTransaction.entries) refundTransaction.entries = [];
            refundTransaction.entries.push(tempEntry);
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

}
export const TransactionService = new service();