import {RouterSet} from "../../config/RouterSet";
import {Passport} from "../../Services/Passport";
import {StorageLocationRepository} from "../../Repository/StorageLocationRepository";

export const AdminController = new RouterSet( (router) => {

    router.get("/manage/inventory", async function(req, res){
        res = await Passport.MakeAdminAccessOnly("Inventory", res);
        res.render("pages/inventory");
    });

    router.get("/manage/store-location", async function(req, res){
        let locations = await StorageLocationRepository.getAll();
        res = await Passport.MakeAdminAccessOnly("Inventory", res);
        res.render("pages/manage_storage",{
            locations: locations
        });
    });

    return router;

});
