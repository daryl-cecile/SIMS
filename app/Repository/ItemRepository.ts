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

    async findByText(text:string) {
        return await this.repo.find( {
            where:{name: Like(`%${text}%`) }
        });
    }

}

export const ItemRepository = new repo();
