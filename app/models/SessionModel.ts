import {Column, Entity, JoinColumn, OneToOne} from "typeorm";
import {BaseModel} from "./IModel";
import {StaffModel} from "./StaffModel";


@Entity("sessions")
export class SessionModel extends BaseModel{

    @Column("varchar",{length: 255, unique:true})
    public sessionKey:string;

    @Column("datetime")
    public expiry:Date;

    @Column("bool",{default:false})
    public invalid:boolean;

    @OneToOne(type => StaffModel, staff => staff.currentSession )
    public owner:StaffModel;

    public get IsValid(){
        return (this.invalid === true || (Date.now() > this.expiry.getTime() + (30 * 60 * 1000) ) );
    }

}