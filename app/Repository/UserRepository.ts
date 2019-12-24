import {BaseRepository} from "./BaseRepository";
import {UserModel} from "../models/UserModel";

class repo extends BaseRepository<UserModel>{

    constructor() {
        super(UserModel);
    }

    async getUserByIdentifierOrEmail(identifierOrEmail:string){

        return await this.repo.findOne({
            where : [
                {identifier: identifierOrEmail},
                {email: identifierOrEmail}
            ]
        });

    }

    async getUserByIdentifier(identifier:string){

        return await this.repo.findOne({
            where : {identifier}
        });

    }

}

export const UserRepository = new repo();