import {Passport} from "../../Services/Passport";
import {TransactionsModel} from "../../models/TransactionsModel";
import {TransactionRepository} from "../../Repository/TransactionRepository";
import {JSONResp} from "../../config/JSONResponse";
import {TransactionService} from "../../Services/TransactionService";

const transactionController = require('express').Router();

transactionController.post("/transactions/issue", async function (req, res){
    let currentUser = await Passport.getCurrentUser(req,res);
    if (currentUser != undefined) {

        let {receivedItems, itemsToUpdate} = await TransactionService.parseReceivedItems(res);

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

module.exports = transactionController;