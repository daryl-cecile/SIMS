import {Column, Entity, JoinColumn, OneToOne} from "typeorm";
import {BaseModel} from "./IModel";
import {ItemModel} from "./ItemModel";
import {StorageLocationModel} from "./StorageLocationModel";

@Entity("stocks")
export class InventoryModel extends BaseModel{

    @OneToOne(type => ItemModel, item => item.inventoryEntry)
    @JoinColumn()
    public item:ItemModel;

    @Column("int")
    public quantity:number;

    @OneToOne(type => StorageLocationModel)
    @JoinColumn()
    public storageLocation: StorageLocationModel;

}