import {StaffModel} from "../models/StaffModel";
import {PermissionModel} from "../models/PermissionModel";
import {AuthModel} from "../models/AuthModel";
import {UserModel} from "../models/UserModel";
import {StorageLocationModel} from "../models/StorageLocationModel";
import {ItemModel} from "../models/ItemModel";
import {InventoryModel} from "../models/InventoryModel";
import {NoticeModel} from "../models/NoticeModel";
import * as Crypto from "crypto";

(async function(){

    const db = require("./DBConnection");

    async function seedPermission(name:string){

        let perm = new PermissionModel();
        perm.name = name;

        let permRepo = db.connection.getRepository(PermissionModel);

        let existingPerm = await permRepo.findOne({ where: {name} });
        if (existingPerm === undefined){
            return await permRepo.save(perm);
        }
        return existingPerm;

    }

    async function seedStaff(firstLastName:string,identifier:string,perms?:PermissionModel[]){

        let staff = new StaffModel();
        staff.email = firstLastName.replace(" ",".") + "@sims.app";
        staff.identifier = identifier;
        staff.firstName = firstLastName.split(" ")[0];
        staff.lastName = firstLastName.split(" ")[1];
        staff.passHash = Crypto.createHash('sha256').update("test123").digest('hex');

        if (perms) staff.permissions = perms;

        let staffRepo = db.connection.getRepository(StaffModel);

        let existingStaff = await staffRepo.findOne({ where: {identifier} });
        if (existingStaff === undefined ){
            return await staffRepo.save(staff);
        }
        return existingStaff;

    }

    async function seedAuth(name:string){

        let auth = new AuthModel();
        auth.name = name;

        let authRepo = db.connection.getRepository(AuthModel);

        let existingAuth = await authRepo.findOne({ where: { name } });
        if (existingAuth === undefined){
            return await authRepo.save(auth);
        }
        return existingAuth;

    }

    async function seedUser(firstLastName:string,identifier:string,auth?:AuthModel){
        let user = new UserModel();
        user.email = firstLastName.replace(" ",".") + "@example.com";
        user.identifier = identifier;
        user.firstName = firstLastName.split(" ")[0];
        user.lastName = firstLastName.split(" ")[1];

        if (auth) user.authentication = auth;

        let userRepo = db.connection.getRepository(UserModel);

        let existingUser = await userRepo.findOne({ where: {identifier} });
        if (existingUser === undefined ){
            return await userRepo.save(user);
        }
        return existingUser;
    }

    async function seedLocation(name:string, location:string){

        let loc = new StorageLocationModel();
        loc.name = name;
        loc.location = location;

        let locRepo = db.connection.getRepository(StorageLocationModel);
        let existingLoc = await locRepo.findOne({ where: {name} });
        if (existingLoc === undefined){
            return await locRepo.save(loc);
        }
        return existingLoc;

    }

    async function seedStock(item:ItemModel,quantity:number, storageLocation:StorageLocationModel){

        let stock = new InventoryModel();
        stock.item = item;
        stock.quantity = quantity;
        stock.storageLocation = storageLocation;

        let stockRepo = db.connection.getRepository(InventoryModel);
        let existingStock = await stockRepo.findOne({ where: { item, storageLocation } });
        if (existingStock === undefined){
            return await stockRepo.save(stock);
        }
        return existingStock;

    }

    async function seedItem(name:string, description:string, unitCount:number, expiry:Date, notices:NoticeModel[]){

        let item = new ItemModel();
        item.name = name;
        item.description = description;
        item.unitCount = unitCount;
        item.expiry = expiry;
        item.notices = notices;

        let itemRepo = db.connection.getRepository(ItemModel);
        let existingItem = await itemRepo.findOne({ where:  {name} });
        if (existingItem === undefined){
            return await itemRepo.save(item);
        }
        return existingItem;

    }

    async function seedNotice(title:string){

        let notice = new NoticeModel();
        notice.title = title;

        let noticeRepo = db.connection.getRepository(NoticeModel);
        let existingNotice = await noticeRepo.findOne({ where: {title} });
        if (existingNotice === undefined){
            return await noticeRepo.save(notice);
        }
        return existingNotice;

    }


    console.log("SEEDING...");


    let adminPerms = [
        await seedPermission("ADMIN"),
        await seedPermission("MANAGE")
    ];

    await seedStaff("Daryl Cecile", "N0698705", adminPerms);
    await seedStaff("Rizwana Khan", "N0698041", adminPerms);
    await seedStaff("Maryanne Parkinson","N0676277",adminPerms);
    await seedStaff("Alex McBean","N0696066",adminPerms);
    await seedStaff("Sean Skidmore","N0749370",adminPerms);
    await seedStaff("Aurimas Gykis","N0749369",adminPerms);

})();