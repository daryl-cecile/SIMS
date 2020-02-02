import {RouterSet} from "../../config/RouterSet";
import {JSONResponse} from "../../config/JSONResponse";
import {ItemRepository} from "../../Repository/ItemRepository";

export const ItemManagementController = new RouterSet((router) => {

    router.get("/items/search", async function(req, res) {
        let searchResults = await ItemRepository.getByItemCode(req.body["itemId"]);
        res.json(JSONResponse(true, "Results", searchResults))
    });

    router.post("/items/itemlist", async function (req, res){
        let listResults = await ItemRepository.getAll();
        res.json(JSONResponse(true, "ItemList", listResults));
    });

    return router;
});
