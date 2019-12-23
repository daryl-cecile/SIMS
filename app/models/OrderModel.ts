import {Column, Entity, JoinColumn, OneToOne} from "typeorm";
import {BaseModel} from "./IModel";
import {StaffModel} from "./StaffModel";

@Entity("orders")
export class OrderModel extends BaseModel{

    @Column("varchar",{length:255, name:"order_reference"})
    public orderReference:string;

    @OneToOne(type => StaffModel)
    @JoinColumn()
    public employee:StaffModel;

}