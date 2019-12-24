import {Column, Entity, JoinColumn, OneToOne} from "typeorm";
import {BaseModel} from "./IModel";
import {UserModel} from "./UserModel";

@Entity("orders")
export class OrderModel extends BaseModel{

    @Column("varchar",{length:255, name:"order_reference"})
    public orderReference:string;

    @OneToOne(type => UserModel,{eager: true})
    @JoinColumn()
    public employee:UserModel;

}