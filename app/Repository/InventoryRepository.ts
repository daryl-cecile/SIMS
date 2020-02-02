import {BaseRepository} from "./BaseRepository";
import {InventoryModel} from "../models/InventoryModel";

class repo extends BaseRepository<InventoryModel> {
    constructor() {
        super(InventoryModel);
    }

    async findByItemId(itemID:number) {
        return await this.repo.findOne( {
            item:{id:itemID}
        })
    }
}

export const InventoryRepository = new repo();