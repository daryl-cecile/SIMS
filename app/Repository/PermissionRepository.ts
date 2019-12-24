import {BaseRepository} from "./BaseRepository";
import {PermissionModel} from "../models/PermissionModel";

class repo extends BaseRepository<PermissionModel>{

    constructor() {
        super(PermissionModel);
    }

    async getPermissionByName(permissionName:string){
        return await this.repo.findOne({
            where: {name: permissionName}
        });
    }

}

export const PermissionRepository = new repo();