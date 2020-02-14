import {RouterSet} from "../../config/RouterSet";
import {Passport} from "../../Services/Passport";
import {StorageLocationRepository} from "../../Repository/StorageLocationRepository";
import {UserRepository} from "../../Repository/UserRepository";

export const AdminController = new RouterSet( (router) => {

    router.get("/manage/inventory", async function(req, res){
        res = await Passport.MakeAdminAccessOnly("Inventory", res);
        res.render("pages/inventory");
    });

    router.get("/manage/store-location", async function(req, res){
        let locations = await StorageLocationRepository.getAll();
        res = await Passport.MakeAdminAccessOnly("Store Location", res);
        res.render("pages/manage_storage",{
            locations: locations
        });
    });

    router.get("/manage/permissions", async function(req, res){
        let users = await UserRepository.getAll();
        res = await Passport.MakeAdminAccessOnly("Permissions", res);
        res.render("pages/manage_permissions",{
            users: users
        });
    });

    return router;

});
