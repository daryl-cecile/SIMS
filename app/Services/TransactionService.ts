import {BaseService} from "./BaseService";
import {ItemModel} from "../models/ItemModel";
import {Items} from "../payloads/ItemList";
import {System} from "../config/System";
import {ItemRepository} from "../Repository/ItemRepository";
import {UserModel} from "../models/UserModel";
import {RefundItemList} from "../payloads/refundItemList";

class service extends BaseService {
    async updateInventory(itemsToUpdate:ItemModel[], receivedItems:Items[], currentUser:UserModel) {
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

    async parseRefundItems(req) {
        let itemsToRefund:RefundItemList = JSON.parse(req.body['data']);
        return itemsToRefund
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