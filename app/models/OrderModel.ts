import {Column, Entity} from "typeorm";
import {BaseModel} from "./IModel";

@Entity("transaction-entry")
export class OrderModel extends BaseModel{

    @Column("integer")
    public itemId:number;

    @Column("integer")
    public quantity:number;

}