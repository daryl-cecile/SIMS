import {PermissionModel} from "../models/PermissionModel";
import {UserModel} from "../models/UserModel";
import {StorageLocationModel} from "../models/StorageLocationModel";
import {ItemModel} from "../models/ItemModel";
import {Passport} from "../Services/Passport";
import {System} from "./System";
import {PermissionRepository} from "../Repository/PermissionRepository";
import {UserRepository} from "../Repository/UserRepository";
import {dbConnector as db} from "./DBConnection";

(async function(){

    async function seedPermission(name:string){

        let perm = new PermissionModel();
        perm.name = name;

        let existingPerm = await PermissionRepository.getPermissionByName(name);
        if (existingPerm === undefined){
            return await PermissionRepository.save(perm);
        }
        return existingPerm;

    }

    async function seedStaff(firstLastName:string,identifier:string,perms?:PermissionModel[]){

        let staff = new UserModel();
        staff.email = firstLastName.replace(" ",".") + "@sims.app";
        staff.identifier = identifier;
        staff.firstName = firstLastName.split(" ")[0];
        staff.lastName = firstLastName.split(" ")[1];
        staff.saltine = Passport.createSaltine();
        staff.passHash = await Passport.hashPassword("test123", staff.saltine);

        if (perms) staff.permissions = perms;

        let existingStaff = await UserRepository.getUserByIdentifier(identifier);
        if (existingStaff === undefined ){
            return await UserRepository.save(staff);
        }
        return existingStaff;

    }

    async function seedUser(firstLastName:string,identifier:string){
        let user = new UserModel();
        user.email = firstLastName.replace(" ",".") + "@example.com";
        user.identifier = identifier;
        user.firstName = firstLastName.split(" ")[0];
        user.lastName = firstLastName.split(" ")[1];

        user.permissions = [ await seedPermission("CUSTOMER") ];

        let existingUser = await UserRepository.getUserByIdentifier(identifier);
        if (existingUser === undefined ){
            return await UserRepository.save(user);
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

    async function seedItem(name:string, description:string, unitCount:number, expiry:Date, notices:string[], q:number, location:StorageLocationModel){

        let item = new ItemModel();
        item.name = name;
        item.description = description;
        item.unitCount = unitCount;
        item.expiry = expiry;
        item.notices = notices.join("\n");
        item.previewImg = "/public/res/sims-logo.png";
        item.storageLocation = location;

        let itemRepo = db.connection.getRepository(ItemModel);
        let existingItem = await itemRepo.findOne({ where:  {name} });
        if (existingItem === undefined){
            return await itemRepo.save(item);
        }
        return existingItem;

    }


    System.log('Status',"SEEDING...", System.ERRORS.NONE);


    let staffPerm = await seedPermission("STAFF");
    let adminPerms = [
        await seedPermission("ADMIN"),
        await seedPermission("MANAGE"),
        staffPerm
    ];

    await seedStaff("Daryl Cecile", "N0698705", adminPerms);
    await seedStaff("Rizwana Khan", "N0698041", adminPerms);
    await seedStaff("Maryanne Parkinson","N0676277",adminPerms);
    await seedStaff("Alex McBean","N0696066",adminPerms);
    await seedStaff("Sean Skidmore","N0749370",adminPerms);
    await seedStaff("Aurimas Gykis","N0749369",adminPerms);

    await seedStaff("Staff User","N9000109", [staffPerm]);

    await seedUser("Test User","N0000100");
    await seedUser("Second User","N0000104");

    // await seedItem("Sample Item","A sample item", 5, new Date(), [
    //     "Store in a wet place",
    //     "Keep away from adults"
    //     ],
    //     10,
    //     await seedLocation("main room","somewhere")
    // );
    //
    // await seedItem("Sample Item TWO","A second sample item", 12, new Date(), [
    //         "Keep away from adults"
    //     ],
    //     10,
    //     await seedLocation("little room","somewhere")
    // );
})();