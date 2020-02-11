import {BaseService} from "./BaseService";
import {ItemModel} from "../models/ItemModel";
import {ItemRepository} from "../Repository/ItemRepository";
import {InventoryModel} from "../models/InventoryModel";
import {InventoryRepository} from "../Repository/InventoryRepository";
import {NoticeModel} from "../models/NoticeModel";

class service extends BaseService {
    /**
     * Creates new item based on received data and creates an accompanying inventory
     * @param req The Request Body
     * @deprecated Requires image handling implementation
     */
    async handleItemCreation(req) {
        let tempInventory:InventoryModel = new InventoryModel();
        let tempItem:ItemModel = req.body['data']['item'];

        tempItem.notices = req.body['data']['notices']?.map(title => {
            let temp = new NoticeModel();
            temp.title = title;
            return temp;
        });
        tempInventory.item = tempItem;
        tempInventory.quantity = req.body['data']['quantity'];
        await InventoryRepository.update(tempInventory)
    }

    /**
     * Deletes the requested item from the DB, cascades deletes occur as expected
     * @param req The Request Body
     */
    async handleItemDeletion(req) {
        await ItemRepository.delete(await ItemRepository.getByItemCode(req.body['data']['id']))
    }

}
export const ItemService = new service();