import {BaseRepository} from "./BaseRepository";
import {ItemModel} from "../models/ItemModel";

class repo extends BaseRepository<ItemModel>{

    constructor() {
        super(ItemModel);
    }

    async getByItemCode(itemCode:number) {
        return await this.repo.findOne({
            where:{id:itemCode}
        })
    }

}

export const ItemRepository = new repo();