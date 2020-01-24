import {BeforeInsert, Column, Entity} from "typeorm";
import {BaseModel} from "./IModel";


@Entity("sims-logs")
export class SystemLogEntryModel extends BaseModel{

    @Column("varchar",{length: 255, nullable: true})
    public title:string;

    @Column("varchar", {length: 255})
    public message:string;

    @Column("text",{nullable:true})
    public extraInformation:string;

    @Column("varchar",{length:12, nullable: true, name:'err-code'})
    public errorCode:string;

    @BeforeInsert()
    private setExpiry(){
        this.expiry = new Date( Date.now() + 30 * 60_000 );
    }

    @Column("varchar")
    public reference:string;

    @Column("datetime")
    public expiry:Date;

}