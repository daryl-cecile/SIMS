import {RouterSet} from "../../config/RouterSet";
import {JSONResponse} from "../../config/JSONResponse";
import {ItemRepository} from "../../Repository/ItemRepository";
import {ItemService} from "../../Services/ItemService";
import {FSManager} from "../../config/FSManager";
import {StorageLocationRepository} from "../../Repository/StorageLocationRepository";
import {StorageLocationModel} from "../../models/StorageLocationModel";

export const ItemsEndpointController = new RouterSet((router) => {

    router.post("/items/delete", async function(req, res) {
        await ItemService.handleItemDeletion(req);
        res.json(JSONResponse(true, "Item Deleted"));
    });

    router.post("/items/update", async function(req, res) {
        let result = await ItemService.handleItemUpdate(req);
        res.json(JSONResponse(true, "Item Created", result));
    });

    router.get("/items/searchbyname", async function(req, res) {
        let searchResults = await ItemRepository.findByText(req.body["term"]);
        res.json(JSONResponse(true, "Results", searchResults));
    });

    router.get("/items/searchbyid", async function(req, res) {
        let searchResults = await ItemRepository.getByItemCode(req.body["itemID"]);
        res.json(JSONResponse(true, "Results", searchResults));
    });

    router.get("/items/itemlist", async function (req, res){
        let listResults = await ItemRepository.getAll();
        res.json(JSONResponse(true, "InventoryList", {
            items: listResults
        }));
    });

    router.get("/items/warnings", async function (req, res){
        let listResults = await ItemRepository.getAll();

        let lowStock = listResults.filter(item => {
            return item.unitCount < 10 && item.unitCount > 0
        });

        let noStock = listResults.filter(item => {
            return item.unitCount <= 0
        });

        res.json(JSONResponse(true, "InventoryList", {
            outOfStock: noStock,
            lowStock: lowStock
        }));
    });

    router.post("/items/save-image", async function(req, res) {
        let files = FSManager.getIncomingFiles();
        files[0].keep();
        res.json(JSONResponse(true, "File", {
            name : files[0].uniqueName
        }));
    });

    router.get("/storage/list", async function(req, res) {
        let locations = await StorageLocationRepository.getAll();
        res.json(JSONResponse(true,"Locations", locations));
    });

    router.post("/storage/update", async function(req, res) {
        let location;
        if (req.body['id']){
            location = await StorageLocationRepository.getById( parseInt(req.body['id']) );
        }
        else{
            location = new StorageLocationModel();
        }
        location.name = req.body['name'];
        location.location = req.body['location'];
        await StorageLocationRepository.save(location);
        res.json(JSONResponse(true));
    });

    router.post("/storage/delete", async function(req, res) {
        let location = await StorageLocationRepository.getById( parseInt(req.body['id']) );
        await StorageLocationRepository.delete(location);
        res.json(JSONResponse(true));
    });

    return router;
});
