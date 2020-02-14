import {Passport} from "../../Services/Passport";
import {TransactionsModel, TransactionType} from "../../models/TransactionsModel";
import {TransactionRepository} from "../../Repository/TransactionRepository";
import {JSONResp, JSONResponse} from "../../config/JSONResponse";
import {RouterSet} from "../../config/RouterSet";
import {TransactionService} from "../../Services/TransactionService";
import {UserRepository} from "../../Repository/UserRepository";
import {Items} from "../../payloads/ItemList";
import {ItemRepository} from "../../Repository/ItemRepository";
import {System} from "../../config/System";
import {OrderModel} from "../../models/OrderModel";

/**
 * DARYL UNIT COUNT IS OUR STOCK, REMEMBER THIS
 */
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
        let itemCode = parseInt(req.body['itemCode']);
        let quantity = parseInt(req.body['quantity']);

        let currentUser = await Passport.getCurrentUser(req,res);

        let refundTransaction = new TransactionsModel();
        refundTransaction.transactionType = TransactionType.RETURN;
        refundTransaction.entries = [];

        let tempItem = await ItemRepository.getByItemCode(itemCode);
        tempItem.unitCount += quantity;
        await ItemRepository.update(tempItem);

        let tempEntry = new OrderModel();
        tempEntry.itemId = itemCode;
        tempEntry.quantity = quantity;
        if (!refundTransaction.entries) refundTransaction.entries = [];
        refundTransaction.entries.push(tempEntry);

        refundTransaction.userOwner = currentUser;
        refundTransaction = await TransactionRepository.update(refundTransaction); // save refund transaction

        await System.log(`Transaction[${refundTransaction.id}]`, `User[${refundTransaction.userOwner.identifier}] refunded ${quantity} of item[${itemCode}]`);

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
        res.json(JSONResponse(true, "All Transactions", await TransactionRepository.getAllOrdered()));
    });


    return router;

});
