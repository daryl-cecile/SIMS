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

            let purchasedItems = await TransactionService.parsePurchasedItems(req);

            let tempTransaction:TransactionsModel = new TransactionsModel();
            tempTransaction.userOwner = currentUser;

            await TransactionService.handlePurchase(tempTransaction, purchasedItems, currentUser);

            res.json( (new JSONResp(true, "Transaction successfully added")).object);
        } else res.json((new JSONResp(false)).object);
    });

    router.post("/transactions/refund", async function(req, res) {
        let {transactionsCode, itemsToRefund} = await TransactionService.parseRefundItems(req);
        let tempTransaction = await TransactionRepository.getByItemCode(transactionsCode);

        await TransactionService.handleRefund(tempTransaction, itemsToRefund);

        res.json(new JSONResp(true, "Refund successful").object);

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
