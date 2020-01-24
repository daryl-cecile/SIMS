import {BaseRepository} from "./BaseRepository";
import {InventoryModel} from "../models/InventoryModel";

class repo extends BaseRepository<InventoryModel> {
    constructor() {
        super(InventoryModel);
    }

}

export const InventoryRepository = new repo();