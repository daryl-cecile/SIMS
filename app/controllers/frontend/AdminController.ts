import {RouterSet} from "../../config/RouterSet";
import {Passport} from "../../Services/Passport";

export const AdminController = new RouterSet( (router) => {

    router.get("/manage/inventory", async function(req, res){
        res = await Passport.MakeAdminAccessOnly("Inventory", res);
        res.render("pages/inventory");
    });

    router.get("/manage/item/new", async function(req, res){
        res = await Passport.MakeAdminAccessOnly("New Item", res);
        res.render("pages/manageItem",{
            title:'Add new item',
            isNew: true
        });
    });

    router.get("/manage/item/edit", async function(req, res){
        res = await Passport.MakeAdminAccessOnly("Edit Item", res);
        res.render("pages/manageItem",{
            title:'Edit item > ',
            isNew: false
        });
    });

    return router;

});
