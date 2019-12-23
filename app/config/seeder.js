"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StaffModel_1 = require("../models/StaffModel");
const PermissionModel_1 = require("../models/PermissionModel");
const AuthModel_1 = require("../models/AuthModel");
const UserModel_1 = require("../models/UserModel");
const StorageLocationModel_1 = require("../models/StorageLocationModel");
const ItemModel_1 = require("../models/ItemModel");
const InventoryModel_1 = require("../models/InventoryModel");
const NoticeModel_1 = require("../models/NoticeModel");
const Crypto = require("crypto");
(async function () {
    const db = require("./DBConnection");
    async function seedPermission(name) {
        let perm = new PermissionModel_1.PermissionModel();
        perm.name = name;
        let permRepo = db.connection.getRepository(PermissionModel_1.PermissionModel);
        let existingPerm = await permRepo.findOne({ where: { name } });
        if (existingPerm === undefined) {
            return await permRepo.save(perm);
        }
        return existingPerm;
    }
    async function seedStaff(firstLastName, identifier, perms) {
        let staff = new StaffModel_1.StaffModel();
        staff.email = firstLastName.replace(" ", ".") + "@sims.app";
        staff.identifier = identifier;
        staff.firstName = firstLastName.split(" ")[0];
        staff.lastName = firstLastName.split(" ")[1];
        staff.passHash = Crypto.createHash('sha256').update("test123").digest('hex');
        if (perms)
            staff.permissions = perms;
        let staffRepo = db.connection.getRepository(StaffModel_1.StaffModel);
        let existingStaff = await staffRepo.findOne({ where: { identifier } });
        if (existingStaff === undefined) {
            return await staffRepo.save(staff);
        }
        return existingStaff;
    }
    async function seedAuth(name) {
        let auth = new AuthModel_1.AuthModel();
        auth.name = name;
        let authRepo = db.connection.getRepository(AuthModel_1.AuthModel);
        let existingAuth = await authRepo.findOne({ where: { name } });
        if (existingAuth === undefined) {
            return await authRepo.save(auth);
        }
        return existingAuth;
    }
    async function seedUser(firstLastName, identifier, auth) {
        let user = new UserModel_1.UserModel();
        user.email = firstLastName.replace(" ", ".") + "@example.com";
        user.identifier = identifier;
        user.firstName = firstLastName.split(" ")[0];
        user.lastName = firstLastName.split(" ")[1];
        if (auth)
            user.authentication = auth;
        let userRepo = db.connection.getRepository(UserModel_1.UserModel);
        let existingUser = await userRepo.findOne({ where: { identifier } });
        if (existingUser === undefined) {
            return await userRepo.save(user);
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
    let adminPerms = [
        await seedPermission("ADMIN"),
        await seedPermission("MANAGE")
    ];
    await seedStaff("Daryl Cecile", "N0698705", adminPerms);
    await seedStaff("Rizwana Khan", "N0698041", adminPerms);
    await seedStaff("Maryanne Parkinson", "N0676277", adminPerms);
    await seedStaff("Alex McBean", "N0696066", adminPerms);
    await seedStaff("Sean Skidmore", "N0749370", adminPerms);
    await seedStaff("Aurimas Gykis", "N0749369", adminPerms);
})();
//# sourceMappingURL=seeder.js.map