"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PermissionModel_1 = require("../models/PermissionModel");
const UserModel_1 = require("../models/UserModel");
const StorageLocationModel_1 = require("../models/StorageLocationModel");
const ItemModel_1 = require("../models/ItemModel");
const InventoryModel_1 = require("../models/InventoryModel");
const NoticeModel_1 = require("../models/NoticeModel");
const Passport_1 = require("../Services/Passport");
const PermissionRepository_1 = require("../Repository/PermissionRepository");
const UserRepository_1 = require("../Repository/UserRepository");
(async function () {
    const db = require("./DBConnection");
    async function seedPermission(name) {
        let perm = new PermissionModel_1.PermissionModel();
        perm.name = name;
        let existingPerm = await PermissionRepository_1.PermissionRepository.getPermissionByName(name);
        if (existingPerm === undefined) {
            return await PermissionRepository_1.PermissionRepository.save(perm);
        }
        return existingPerm;
    }
    async function seedStaff(firstLastName, identifier, perms) {
        let staff = new UserModel_1.UserModel();
        staff.email = firstLastName.replace(" ", ".") + "@sims.app";
        staff.identifier = identifier;
        staff.firstName = firstLastName.split(" ")[0];
        staff.lastName = firstLastName.split(" ")[1];
        staff.saltine = Passport_1.Passport.createSaltine();
        staff.passHash = await Passport_1.Passport.hashPassword("test123", staff.saltine);
        if (perms)
            staff.permissions = perms;
        let existingStaff = await UserRepository_1.UserRepository.getUserByIdentifier(identifier);
        if (existingStaff === undefined) {
            return await UserRepository_1.UserRepository.save(staff);
        }
        return existingStaff;
    }
    async function seedUser(firstLastName, identifier) {
        let user = new UserModel_1.UserModel();
        user.email = firstLastName.replace(" ", ".") + "@example.com";
        user.identifier = identifier;
        user.firstName = firstLastName.split(" ")[0];
        user.lastName = firstLastName.split(" ")[1];
        user.permissions = [await seedPermission("CUSTOMER")];
        let existingUser = await UserRepository_1.UserRepository.getUserByIdentifier(identifier);
        if (existingUser === undefined) {
            return await UserRepository_1.UserRepository.save(user);
        }
        return existingUser;
    }
    async function seedLocation(name, location) {
        let loc = new StorageLocationModel_1.StorageLocationModel();
        loc.name = name;
        loc.location = location;
        let locRepo = db.connection.getRepository(StorageLocationModel_1.StorageLocationModel);
        let existingLoc = await locRepo.findOne({ where: { name } });
        if (existingLoc === undefined) {
            return await locRepo.save(loc);
        }
        return existingLoc;
    }
    async function seedStock(item, quantity, storageLocation) {
        let stock = new InventoryModel_1.InventoryModel();
        stock.item = item;
        stock.quantity = quantity;
        stock.storageLocation = storageLocation;
        let stockRepo = db.connection.getRepository(InventoryModel_1.InventoryModel);
        let existingStock = await stockRepo.findOne({ where: { item, storageLocation } });
        if (existingStock === undefined) {
            return await stockRepo.save(stock);
        }
        return existingStock;
    }
    async function seedItem(name, description, unitCount, expiry, notices) {
        let item = new ItemModel_1.ItemModel();
        item.name = name;
        item.description = description;
        item.unitCount = unitCount;
        item.expiry = expiry;
        item.notices = notices;
        let itemRepo = db.connection.getRepository(ItemModel_1.ItemModel);
        let existingItem = await itemRepo.findOne({ where: { name } });
        if (existingItem === undefined) {
            return await itemRepo.save(item);
        }
        return existingItem;
    }
    async function seedNotice(title) {
        let notice = new NoticeModel_1.NoticeModel();
        notice.title = title;
        let noticeRepo = db.connection.getRepository(NoticeModel_1.NoticeModel);
        let existingNotice = await noticeRepo.findOne({ where: { title } });
        if (existingNotice === undefined) {
            return await noticeRepo.save(notice);
        }
        return existingNotice;
    }
    console.log("SEEDING...");
    let staffPerm = await seedPermission("STAFF");
    let adminPerms = [
        await seedPermission("ADMIN"),
        await seedPermission("MANAGE"),
        staffPerm
    ];
    await seedStaff("Daryl Cecile", "N0698705", adminPerms);
    await seedStaff("Rizwana Khan", "N0698041", adminPerms);
    await seedStaff("Maryanne Parkinson", "N0676277", adminPerms);
    await seedStaff("Alex McBean", "N0696066", adminPerms);
    await seedStaff("Sean Skidmore", "N0749370", adminPerms);
    await seedStaff("Aurimas Gykis", "N0749369", adminPerms);
    await seedStaff("Staff User", "N9000109", [staffPerm]);
    await seedUser("Test User", "N0000100");
    await seedUser("Second User", "N0000104");
})();
//# sourceMappingURL=seeder.js.map