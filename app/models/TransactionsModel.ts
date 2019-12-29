import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {BaseModel} from "./IModel";
import {UserModel} from "./UserModel";
import {ItemModel} from "./ItemModel";

/**
 * A transactions model used to map customer purchases. Also used for mapping in ORM
 */
@Entity("Transactions")
export class TransactionsModel extends BaseModel {

    @ManyToMany(type => ItemModel)
    @JoinTable()
    public items:ItemModel[];

    @ManyToOne(type => UserModel, user => user.transactions )
    @JoinColumn()
    public userOwner:UserModel;
}