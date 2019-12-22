import {IModel} from "./IModel";
import {Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {TestModel} from "./TestModel";

@Entity("user_table")
export class UserModel implements IModel{

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar",{length:255})
    public firstName:string;

    @Column("varchar",{length:255})
    public lastName:string;

    @OneToMany(type => TestModel, test => test.user, {cascade:["insert","update"]})
    public tests:TestModel[];
}