import {Passport} from "../../Services/Passport";
import {TransactionsModel} from "../../models/TransactionsModel";
import {TransactionRepository} from "../../Repository/TransactionRepository";
import {JSONResp, JSONResponse} from "../../config/JSONResponse";
import {RouterSet} from "../../config/RouterSet";
import {TransactionService} from "../../Services/TransactionService";

export const TransactionsEndpointController = new RouterSet((router)=>{

    router.post("/transactions/issue", async function (req, res){
        let currentUser = await Passport.getCurrentUser(req,res);
        if (currentUser != undefined) {

            let {receivedItems, itemsToUpdate} = await TransactionService.parseReceivedItems(req);

            let tempTransaction:TransactionsModel = new TransactionsModel();
            tempTransaction.userOwner = currentUser;
            tempTransaction.items = itemsToUpdate;

            //Add Transaction
            await TransactionRepository.update(tempTransaction);

            // Update the inventory
            await TransactionService.updateInventory(itemsToUpdate, receivedItems, currentUser);

            //TODO Add transaction log
            res.json( (new JSONResp(true, "Transaction successfully added")).object);
        } else res.json((new JSONResp(false)).object);
    });

    router.post("/transactions/refund", async function(req, res) {
        let {receivedItems, itemsToUpdate} = await TransactionService.parseReceivedItems(req);


    });

    router.get("/transactions/list", async function (req, res) {
        // Gets the current user that is logged in.
        let currentUser = await Passport.getCurrentUser(req,res);
        // Gets all transactions on record for the current user.
        let userTransactions = currentUser.transactions;

        // Returns all information in json format.
        res.json(JSONResponse(true, "transactionRecord", userTransactions));

    });


    return router;

});
