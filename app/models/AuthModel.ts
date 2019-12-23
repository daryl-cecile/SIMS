import {BaseModel} from "./IModel";
import {Column, Entity} from "typeorm";

@Entity("auth")
export class AuthModel extends BaseModel{

    @Column("varchar",{length: 255, nullable:false})
    name:string;

}