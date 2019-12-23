import {Column, Entity} from "typeorm";
import {BaseModel} from "./IModel";


@Entity("storageLocations")
export class StorageLocationModel extends BaseModel{

    @Column("varchar",{length:255})
    public name:string;

    @Column("varchar",{length:255})
    public location:string;

}