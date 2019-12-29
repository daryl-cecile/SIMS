import {Entity, JoinColumn, ManyToOne} from "typeorm";
import {BaseModel} from "./IModel";
import {UserModel} from "./UserModel";


@Entity("Transactions")
export class TransactionsModel extends BaseModel {
    @ManyToOne(type => UserModel, user => user.transactions )
    @JoinColumn()
    public userOwner:UserModel
}