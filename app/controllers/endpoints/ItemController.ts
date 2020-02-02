import {RouterSet} from "../../config/RouterSet";
import {Items} from "../../payloads/ItemList";
import {ItemModel} from "../../models/ItemModel";
import {JSONResp, JSONResponse} from "../../config/JSONResponse";

export const ItemManagementController = new RouterSet((router) => {

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
