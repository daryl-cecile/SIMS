import {BaseRepository} from "./BaseRepository";
import {TransactionsModel} from "../models/TransactionsModel";
import {UserModel} from "../models/UserModel";

class repo extends BaseRepository<TransactionsModel>{

    constructor() {
        super(TransactionsModel);
    }

    async getByItemCode(itemCode:number) {
        return await this.repo.findOne({
            where:{id:itemCode}
        })
    }

    async getByUser(user:UserModel) {
        return await this.repo.find( {
            where:{userOwner:user}
        })
    }
}

export const TransactionRepository = new repo();