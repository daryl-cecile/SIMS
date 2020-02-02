import {RouterSet} from "../../config/RouterSet";
import {InventoryRepository} from "../../Repository/InventoryRepository";
import {JSONResponse} from "../../config/JSONResponse";

export const StocksEndpointController = new RouterSet((router)=>{

    router.get("stocks/searchbyid",async function  (req, res) {
       let searchResults = InventoryRepository.findByItemId(req.body["itemid"]);
       res.json(JSONResponse(true, "Results", searchResults));
    });
    router.get("/items/searchbyname", async function(req, res) {
        let searchResults = await InventoryRepository.findByText(req.body["term"]);
        res.json(JSONResponse(true, "Results", searchResults))
    });
    return router;
});