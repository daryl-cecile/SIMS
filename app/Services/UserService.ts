import {BaseService} from "./BaseService";
import {UserModel} from "../models/UserModel";
import {UserRepository} from "../Repository/UserRepository";
import {Passport} from "./Passport";
import {isNullOrUndefined} from "../config/convenienceHelpers";
import {PermissionRepository} from "../Repository/PermissionRepository";
import {PermissionModel} from "../models/PermissionModel";

class service extends BaseService{

    async createUser(req) {
        let tempStaff = new UserModel();
        tempStaff.email = req.body['email'];
        tempStaff.firstName = req.body['firstname'];
        tempStaff.lastName = req.body['lastname'];
        tempStaff.identifier = req.body['identifier'];


        // Add permissions add new permissions if they don't exist
        for (const permission of req.body['permissions']) {
            if (isNullOrUndefined(PermissionRepository.getPermissionByName(permission))){
                let tempPerm = new PermissionModel();
                tempPerm.name = permission;
                await PermissionRepository.update(tempPerm);
            }
            else tempStaff.permissions.push(await PermissionRepository.getPermissionByName(permission));
        }


        // Add password if it exists
        if (!isNullOrUndefined(req.body['password'])) {
            tempStaff.saltine = Passport.createSaltine();
            tempStaff.passHash = await Passport.hashPassword(req.body['password'],tempStaff.saltine);
        }

        // Check if user doesn't already exist
        if (isNullOrUndefined(await UserRepository.getUserByIdentifier(tempStaff.identifier)) ){
            await UserRepository.update(tempStaff);
            return true;
        } else {
            return false;
        }
    }

    async editPermissions(userAccount:UserModel, req) {

        if (!isNullOrUndefined(req.body['add'])) {
            for (const permission of req.body['add']){
                let tempPerm = await PermissionRepository.getPermissionByName(permission);
                userAccount.permissions.push(tempPerm);

            }
        }

        // Sloppy nested loop but it works as the permissions list is already small, could be refactored later
        if (!isNullOrUndefined(req.body['remove'])) {
            for (const permission of req.body['remove']){
                for (const userPerm of userAccount.permissions) {
                    if (permission == userPerm.name) {
                        userAccount.permissions.splice(userAccount.permissions.indexOf(userPerm),1);
                    }
                }
            }
        }

        await UserRepository.update(userAccount);

    }

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
        for (const perm of userAccount.permissions){
            if (perm.name === permissionName){
                return true;
            }
        }
        return false;
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