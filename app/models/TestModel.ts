import {IModel} from "./IModel";
import {UserModel} from "./UserModel";
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity("test_table")
export class TestModel implements IModel{

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar",{length:255})
    public name:string;

    @ManyToOne(type => UserModel, user => user.tests, {cascade: ["insert","update"]})
    @JoinColumn()
    public user:UserModel;

}