import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {BaseModel} from "./IModel";
import {UserModel} from "./UserModel";
import {ItemModel} from "./ItemModel";
import {OrderModel} from "./OrderModel";

export enum TransactionType{
    PURCHASE,
    RETURN
}

/**
 * A transactions model used to map customer purchases. Also used for mapping in ORM
 */
@Entity("Transactions")
export class TransactionsModel extends BaseModel {

    @ManyToMany(type => OrderModel, {
        cascade: true
    })
    @JoinTable()
    public entries:OrderModel[];

    @ManyToOne(type => UserModel, user => user.transactions)
    @JoinColumn()
    public userOwner:UserModel;

    @Column("enum",{ enum: TransactionType, default: TransactionType.PURCHASE })
    public transactionType: TransactionType;

}