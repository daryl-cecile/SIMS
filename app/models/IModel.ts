import {CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export interface IModel{
    id:number;
}

export abstract class BaseModel implements IModel{

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({name:"created_at"})
    createdAt: Date;

    @UpdateDateColumn({name:"updated_at"})
    updatedAt: Date;

}
