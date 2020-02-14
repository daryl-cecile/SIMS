import {BaseRepository} from "./BaseRepository";
import {TransactionsModel} from "../models/TransactionsModel";
import {UserModel} from "../models/UserModel";

class repo extends BaseRepository<TransactionsModel>{

    constructor() {
        super(TransactionsModel);
    }

    async getById(transactionId:number) {
        return await this.repo.findOne({
            relations: ['userOwner', 'entries'],
            where:{id:transactionId}
        })
    }

    async getByUser(user:UserModel) {
        return await this.repo.find( {
            relations: ['userOwner', 'entries'],
            where:{userOwner:user}
        })
    }

    async getAll() {
        return await this.repo.find({
            relations:['userOwner', 'entries']
        });
    }

    async getAllOrdered(){
        return await this.repo.find({
            relations: ['userOwner', 'entries'],
            order:{
                createdAt:"DESC"
            }
        })
    }
}

export const TransactionRepository = new repo();