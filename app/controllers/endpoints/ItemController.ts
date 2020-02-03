import {RouterSet} from "../../config/RouterSet";
import {JSONResponse} from "../../config/JSONResponse";
import {ItemRepository} from "../../Repository/ItemRepository";
import {ItemService} from "../../Services/ItemService";

export const ItemsEndpointController = new RouterSet((router) => {

    router.post("/items/delete", async function(req, res) {
        await ItemService.handleItemDeletion(req);
        res.json(JSONResponse(true, "Item Deleted"))
    });

    router.post("/items/create", async function(req, res) {
        await ItemService.handleItemCreation(req);
        res.json(JSONResponse(true, "Item Created"));
    });

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
