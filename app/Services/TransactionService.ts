import {BaseService} from "./BaseService";
import {ItemModel} from "../models/ItemModel";
import {Items} from "../payloads/ItemList";
import {System} from "../config/System";
import {ItemRepository} from "../Repository/ItemRepository";
import {UserModel} from "../models/UserModel";
import {RefundItemList} from "../payloads/refundItemList";
import {TransactionsModel} from "../models/TransactionsModel";
import {TransactionRepository} from "../Repository/TransactionRepository";

class service extends BaseService {
    async updateInventory(itemsToUpdate:ItemModel[], receivedItems:Items[], currentUser:UserModel) {
        for (const item of receivedItems) {
            itemsToUpdate.findIndex(element => element.id)
        }

        //This could be done more cleanly but oh well.
        for (const itemToUpdate of itemsToUpdate) {
            for (const receivedItem of receivedItems) {
                if (itemToUpdate.id == receivedItem.id){
                    itemToUpdate.inventoryEntry.quantity -= receivedItem.quantity;
                    if (itemToUpdate.inventoryEntry.quantity < 0) {
                        await System.log("Transactions[" + itemToUpdate.id + "]",
                            "User: " + currentUser.identifier + " attempted to issue more items than currently held")
                    } else {
                        await System.log("Transaction [" + itemToUpdate.id + "]","Items Issued to, " +
                            currentUser.identifier);
                    }
                    await ItemRepository.update(itemToUpdate);
                }
            }
        }
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

    async parseReceivedItems(req) {
        let receivedItems:Items[] = Object.keys(req.body['items'])
            .map(id => new Items(parseInt(id), req.body['items'][id]) );
        let itemsToUpdate:ItemModel[] = await Promise.all(
            receivedItems.map(async i => {
                return await ItemRepository.getByItemCode(i.id)
            })
        );

        return {
            receivedItems,
            itemsToUpdate
        }
    }
}
export const TransactionService = new service();