import {RouterSet} from "../../config/RouterSet";
import {JSONResponse} from "../../config/JSONResponse";
import {ItemRepository} from "../../Repository/ItemRepository";

export const ItemsEndpointController = new RouterSet((router) => {

    router.get("/items/searchbyname", async function(req, res) {
        let searchResults = await ItemRepository.findByText(req.body["term"]);
        res.json(JSONResponse(true, "Results", searchResults))
    });

    router.get("/items/searchbyid", async function(req, res) {
        let searchResults = await ItemRepository.getByItemCode(req.body["itemID"]);
        res.json(JSONResponse(true, "Results", searchResults))
    });

    router.get("/items/itemlist", async function (req, res){
        let listResults = await ItemRepository.getAll();
        res.json(JSONResponse(true, "ItemList", listResults));
    });

    return router;
});
