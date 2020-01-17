import {Passport} from "../../Services/Passport";
import {Items} from "../../payloads/ItemList";
import {TransactionsModel} from "../../models/TransactionsModel";
import {ItemModel} from "../../models/ItemModel";
import {ItemRepository} from "../../Repository/ItemRepository";
import {TransactionRepository} from "../../Repository/TransactionRepository";
import {JSONResp} from "../../config/JSONResponse";

const transactionController = require('express').Router();

transactionController.post("/transactions/issue", async function (req, res){
    let currentUser = await Passport.getCurrentUser(req,res);
    if (currentUser != undefined) {
        let items:Items[] = Object.keys(res.body['items'])
            .map(itemcode => new Items(itemcode, res.body['items'][itemcode]));
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

module.exports = transactionController;