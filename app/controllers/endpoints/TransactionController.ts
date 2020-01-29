import {Passport} from "../../Services/Passport";
import {Items} from "../../payloads/ItemList";
import {TransactionsModel} from "../../models/TransactionsModel";
import {ItemModel} from "../../models/ItemModel";
import {ItemRepository} from "../../Repository/ItemRepository";
import {TransactionRepository} from "../../Repository/TransactionRepository";
import {JSONResp, JSONResponse} from "../../config/JSONResponse";
import {RouterSet} from "../../config/RouterSet";

export const TransactionEndpointController = new RouterSet((router) => {

    router.post("/transactions/issue", async function (req, res){
        let currentUser = await Passport.getCurrentUser(req,res);
        if (currentUser != undefined) {
            let items:Items[] = Object.keys(req.body['items'])
                .map(itemcode => new Items(itemcode, req.body['items'][itemcode]));
            let tempItems:ItemModel[] = await Promise.all(
                items.map(async i => {
                    return await ItemRepository.getByItemCode( parseInt(i.itemCode) )
                })
            );
            let tempTransaction:TransactionsModel = new TransactionsModel();
            tempTransaction.userOwner = currentUser;
            tempTransaction.items = tempItems;

            await TransactionRepository.update(tempTransaction);

            //TODO Update the quantity of items held in stock
            //TODO Add transaction log
            res.json( (new JSONResp(true, "Transaction successfully added")).object);
        } else res.json((new JSONResp(false)).object);
    });

    router.get("/transactions/usertransrec", async function (req, res) {
        // Gets the current user that is logged in.
        let currentUser = await Passport.getCurrentUser(req,res);
        // Gets all transactions on record for the current user.
        let userTransactions = currentUser.transactions;
    
        // Returns all information in json format.
        res.json(JSONResponse(true, "transactionRecord", userTransactions));
        
    });
    return router;

});
