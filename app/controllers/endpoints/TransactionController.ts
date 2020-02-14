import {Passport} from "../../Services/Passport";
import {TransactionsModel} from "../../models/TransactionsModel";
import {TransactionRepository} from "../../Repository/TransactionRepository";
import {JSONResp, JSONResponse} from "../../config/JSONResponse";
import {RouterSet} from "../../config/RouterSet";
import {TransactionService} from "../../Services/TransactionService";
import {UserRepository} from "../../Repository/UserRepository";
import {Items} from "../../payloads/ItemList";

export const TransactionsEndpointController = new RouterSet((router)=>{

    router.post("/transactions/issue", async function (req, res){
        let currentUser = await Passport.getCurrentUser(req,res);
        if (currentUser != undefined) {

            let purchasedItems:Items[] = req.body['data'];

            let tempTransaction:TransactionsModel = new TransactionsModel();
            tempTransaction.userOwner = currentUser;

            let finalTransaction = await TransactionService.handlePurchase(tempTransaction, purchasedItems, currentUser);

            res.json( (new JSONResp(true, "Transaction successfully added", {transactionId: finalTransaction.id})).object);
        } else res.json((new JSONResp(false)).object);
    });

    router.post("/transactions/refund", async function(req, res) {
        let {transactionsCode, itemsToRefund} = await TransactionService.parseRefundItems(req);
        let tempTransaction = await TransactionRepository.getById(transactionsCode);

        await TransactionService.handleRefund(tempTransaction, itemsToRefund);

        res.json(new JSONResp(true, "Refund successful").object);

    });

    router.get("/transactions/list", async function (req, res) {
        // Gets the current user that is logged in.
        let currentUser = await UserRepository.getUserByIdentifier(req.body["identifier"]);
        // Gets all transactions on record for the current user.
        let tempTransactions = await TransactionRepository.getByUser(currentUser);
        // Returns all information in json format.
        res.json(JSONResponse(true, "transactionRecord", tempTransactions));
    });

    router.get("/transactions/listall", async function (req, res) {
        res.json(JSONResponse(true, "All Transactions", await TransactionRepository.getAll()));
    });


    return router;

});
