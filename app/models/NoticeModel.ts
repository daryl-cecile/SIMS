import {BaseModel} from "./IModel";
import {Column, Entity} from "typeorm";


@Entity("notices")
export class NoticeModel extends BaseModel{

    @Column("varchar",{length:255})
    public title:string;

}