import {BaseService} from "./BaseService";
import {ItemModel} from "../models/ItemModel";
import {ItemRepository} from "../Repository/ItemRepository";
import {dbConnector as db, dbConnector} from "../config/DBConnection";
import {System} from "../config/System";
import {StorageLocationModel} from "../models/StorageLocationModel";

class service extends BaseService {
    /**
     * Creates new item based on received data and creates an accompanying inventory
     * @param req The Request Body
     */
    async handleItemUpdate(req) {
        let inv:ItemModel = System.marshallToClass(req.body.entry, ItemModel);
        if (req.body.entry.storageLocation) inv.storageLocation = System.marshallToClass(req.body.entry.storageLocation, StorageLocationModel);
        inv.notices = req.body.entry.notices;
        return await ItemRepository.update(inv);
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