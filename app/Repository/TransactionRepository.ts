import {BaseRepository} from "./BaseRepository";
import {TransactionsModel} from "../models/TransactionsModel";
import {UserModel} from "../models/UserModel";

class repo extends BaseRepository<TransactionsModel>{

    constructor() {
        super(TransactionsModel);
    }

    async getById(transactionId:number) {
        return await this.repo.findOne({
            where:{id:transactionId}
        })
    }

    async getByUser(user:UserModel) {
        return await this.repo.find( {
            where:{userOwner:user}
        })
    }

    async getAll() {
        return await this.repo.find();
    }
}

export const TransactionRepository = new repo();