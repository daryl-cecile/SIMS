import {BaseModel} from "./IModel";
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne} from "typeorm";
import {PermissionModel} from "./PermissionModel";
import {SessionModel} from "./SessionModel";

@Entity("staffs")
export class StaffModel extends BaseModel{

    @Column("varchar",{length:255, nullable: true})
    public firstName:string;

    @Column("varchar",{length:255, nullable: true})
    public lastName:string;

    @Column("varchar", {length:255, nullable:true})
    public email:string;

    @Column("varchar",{length:8, unique: true})
    public identifier:string;

    @Column("varchar",{length:255, nullable:false, name:"password_hash"})
    public passHash:string;

    @OneToOne( type => SessionModel, session => session.owner ,   { nullable: true, cascade:['insert','update'] } )
    @JoinColumn()
    public currentSession:SessionModel;

    @ManyToMany(type => PermissionModel )
    @JoinTable()
    public permissions:PermissionModel[];

}