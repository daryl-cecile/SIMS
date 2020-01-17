import {BaseRepository} from "./BaseRepository";
import {TransactionsModel} from "../models/TransactionsModel";

class repo extends BaseRepository<TransactionsModel>{

    constructor() {
        super(TransactionsModel);
    }
}

export const TransactionRepository = new repo();