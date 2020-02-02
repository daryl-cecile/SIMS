import {BaseRepository} from "./BaseRepository";
import {InventoryModel} from "../models/InventoryModel";
import {Like} from "typeorm";

class repo extends BaseRepository<InventoryModel> {
    constructor() {
        super(InventoryModel);
    }

    async findByItemId(itemID:number) {
        return await this.repo.findOne({
            where : {
                item:{ id:itemID }
            }
        });
    }

    async findByText(text:string) {
        return await this.repo.find( {
            where:{name: Like(`%${text}%`) }
        });
    }
}

export const InventoryRepository = new repo();
