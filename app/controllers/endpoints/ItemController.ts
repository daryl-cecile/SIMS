import {RouterSet} from "../../config/RouterSet";
import {JSONResponse} from "../../config/JSONResponse";

export const ItemManagementController = new RouterSet((router) => {

    router.get("/items/search", async function(req, res) {
        res.json

    });

    router.post("/item-management/item", async function (req, res){
        // ItemModel
        res.json(JSONResponse(true, "ItemDetails"));
    });

    router.post("/item-management/itemlist", async function (req, res){
        // ItemList
        res.json(JSONResponse(true, "ItemListDetails"));
    });

    return router;

});
