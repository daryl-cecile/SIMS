import {BaseRepository} from "./BaseRepository";
import {StorageLocationModel} from "../models/StorageLocationModel";

class repo extends BaseRepository<StorageLocationModel>{

    constructor() {
        super(StorageLocationModel);
    }

    async getById(id:number){
        return await this.repo.findOne({
            where: {id}
        });
    }

}

export const StorageLocationRepository = new repo();