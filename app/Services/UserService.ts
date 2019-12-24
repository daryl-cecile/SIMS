import {BaseService} from "./BaseService";
import {UserModel} from "../models/UserModel";
import {PermissionRepository} from "../Repository/PermissionRepository";
import {UserRepository} from "../Repository/UserRepository";

class service extends BaseService{

    async isUserStaffMember(userAccount:UserModel){
        let staffPermissions = ["STAFF","MANAGE","ADMIN"];
        for (let i = 0; i < userAccount.permissions.length; i++){
            if ( staffPermissions.indexOf(userAccount.permissions[i].name) > -1 ) {
                return true;
            }
        }
        return false;
    }

    async hasPermission(userAccount:UserModel, permissionName:string){
        return userAccount.permissions.indexOf( await PermissionRepository.getPermissionByName(permissionName) );
    }

    async getAllCustomers(){
        let users = await UserRepository.getAll();
        let finalList:UserModel[] = [];

        for (const u of users) {
            if ( (await this.isUserStaffMember(u)) === false ){
                finalList.push(u);
            }
        }

        return finalList;
    }

    async getAllStaffMembers(){

        let users = await UserRepository.getAll();
        let finalList:UserModel[] = [];

        for (const u of users) {
           if ( await this.isUserStaffMember(u) ){
               finalList.push(u);
           }
        }

        return finalList;

    }

}

export const UserService = new service();