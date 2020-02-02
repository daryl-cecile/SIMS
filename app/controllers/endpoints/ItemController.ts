import {RouterSet} from "../../config/RouterSet";
import {JSONResponse} from "../../config/JSONResponse";
import {ItemRepository} from "../../Repository/ItemRepository";

export const ItemManagementController = new RouterSet((router) => {

    router.get("/items/search", async function(req, res) {
        let searchResults = await ItemRepository.findByText(req.body["term"]);
        res.json(JSONResponse(true, "Results", searchResults))
    });

    router.post("/items/item", async function (req, res){
        // ItemModel
        res.json(JSONResponse(true, "ItemDetails"));
    });

    return router;
});
