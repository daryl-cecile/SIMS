import {BaseRepository} from "./BaseRepository";
import {ItemModel} from "../models/ItemModel";
import {Like} from "typeorm";

class repo extends BaseRepository<ItemModel>{

    constructor() {
        super(ItemModel);
    }

    async getByItemCode(itemCode:number) {
        return await this.repo.findOne({
            where:{id:itemCode}
        })
    }

    async findByText(text:string) {
        return await this.repo.find( {
            where:{name: Like(`%${text}%`) }
        });
    }


    async findByTextSingle(text:string) {
        return await this.repo.findOne( {
            where:{name:text}
        });
    }
    async getAll(){
        return await this.repo.find({
            relations:['inventoryEntry']
        })
    }
}

export const ItemRepository = new repo();
