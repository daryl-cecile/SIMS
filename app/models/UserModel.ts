import {BaseModel, IModel} from "./IModel";
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne} from "typeorm";
import {AuthModel} from "./AuthModel";

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

    @ManyToMany(type => AuthModel)
    @JoinTable()
    public authentication:AuthModel;

}