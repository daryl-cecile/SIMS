import {BaseModel, jsonIgnore} from "./IModel";
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne} from "typeorm";
import {SessionModel} from "./SessionModel";
import {PermissionModel} from "./PermissionModel";
import {TransactionsModel} from "./TransactionsModel";

@Entity("users")
export class UserModel extends BaseModel{

    @Column("varchar",{length:255, nullable: true})
    public firstName:string;

    @Column("varchar",{length:255, nullable: true})
    public lastName:string;

    @Column("varchar", {length:255, nullable:true})
    public email:string;

    @Column("varchar",{length:8, unique: true})
    public identifier:string;

    @Column("varchar",{length:255, nullable:true, name:"password_hash"})
    @jsonIgnore()
    public passHash:string;

    @Column("varchar", {length:255,nullable:true, name:"saltine"})
    @jsonIgnore()
    public saltine:string;

    @OneToOne( type => SessionModel, session => session.owner ,   {
        nullable: true,
        cascade:['insert','update','remove'],
        eager: true
    } )
    @JoinColumn()
    @jsonIgnore()
    public currentSession:SessionModel;

    @ManyToMany(type => PermissionModel ,{
        eager: true
    })
    @JoinTable()
    @jsonIgnore()
    public permissions:PermissionModel[];

    @OneToMany(type => TransactionsModel, transaction => transaction.userOwner, {
        cascade:true,
        eager:true
    })
    public transactions:TransactionsModel[];

}