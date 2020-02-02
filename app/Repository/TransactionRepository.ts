import {BaseRepository} from "./BaseRepository";
import {TransactionsModel} from "../models/TransactionsModel";

class repo extends BaseRepository<TransactionsModel>{

    constructor() {
        super(TransactionsModel);
    }

    async getByItemCode(itemCode:number) {
        return await this.repo.findOne({
            where:{id:itemCode}
        })
    }
}

export const TransactionRepository = new repo();