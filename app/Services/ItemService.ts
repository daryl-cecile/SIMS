import {BaseService} from "./BaseService";
import {ItemModel} from "../models/ItemModel";
import {ItemRepository} from "../Repository/ItemRepository";
import {System} from "../config/System";
import {StorageLocationRepository} from "../Repository/StorageLocationRepository";

class service extends BaseService {
    /**
     * Creates new item based on received data and creates an accompanying inventory
     * @param req The Request Body
     */
    async handleItemUpdate(req) {
        let inv:ItemModel = await System.marshallToClass(req.body.entry, ItemModel);
        inv.storageLocation = await StorageLocationRepository.getById(parseInt(req.body.entry.storageLocation.id));
        inv.notices = req.body.entry.notices;
        return await ItemRepository.update(inv);
    }

    /**
     * Deletes the requested item from the DB, cascades deletes occur as expected
     * @param req The Request Body
     */
    async handleItemDeletion(req) {
        await ItemRepository.removeMultipleById( ...req.body['itemIdCollection'] );
    }

}
export const ItemService = new service();