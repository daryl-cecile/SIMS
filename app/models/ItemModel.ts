import {Column, Entity, JoinTable, ManyToMany, OneToOne} from "typeorm";
import {BaseModel} from "./IModel";
import {NoticeModel} from "./NoticeModel";
import {InventoryModel} from "./InventoryModel";


@Entity("items")
export class ItemModel extends BaseModel{

    @Column("varchar", {length: 255})
    public name:string;

    @Column("text")
    public description:string;

    @ManyToMany(type=> NoticeModel)
    @JoinTable()
    public notices:NoticeModel[];

    @Column("int",{default:1})
    public unitCount:number;

    @Column("datetime", {nullable:true})
    public expiry:Date;

    @OneToOne(type => InventoryModel, inventory => inventory.item, {
        cascade:['update','insert']
    })
    public inventoryEntry: InventoryModel;

}