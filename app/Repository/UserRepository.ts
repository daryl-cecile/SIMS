import {BaseRepository} from "./BaseRepository";
import {UserModel} from "../models/UserModel";

class UserRepository extends BaseRepository<UserModel>{

    constructor() {
        super("user_table", UserModel);
    }

}

module.exports = new UserRepository();