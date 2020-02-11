import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne} from "typeorm";
import {BaseModel} from "./IModel";
import {StorageLocationModel} from "./StorageLocationModel";


@Entity("items")
export class ItemModel extends BaseModel{

    @Column("varchar", {length: 255})
    public name:string;

    @Column("text")
    public description:string;

    @Column("text")
    public notices:string;

    @Column("int",{default:1})
    public unitCount:number;

    @Column("varchar", {length:255, nullable: true})
    public previewImg:string;

    @Column("datetime", {nullable:true})
    public expiry:Date;

    @Column("int")
    public quantity:number;

    @OneToOne(type => StorageLocationModel, {
        eager: true
    })
    @JoinColumn()
    public storageLocation: StorageLocationModel;

}