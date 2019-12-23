import {BaseModel} from "./IModel";
import {Column, Entity} from "typeorm";

@Entity("permission")
export class PermissionModel extends BaseModel{

    @Column("varchar",{length: 255, nullable:false})
    public name:string;

}