import {RouterSet} from "../../config/RouterSet";
import {Passport} from "../../Services/Passport";
import { TransactionRepository } from "../../Repository/TransactionRepository";
import { Transaction } from "typeorm";
import { ItemRepository } from "../../Repository/ItemRepository";

export const TransactionController = new RouterSet( (router) => {

    router.get("/confirm", async function(req, res){
        res.render("pages/confirm_transaction");
    });


    router.get("/report", async function(req, res){
        let currentUser = await Passport.getCurrentUser(req,res);


        let k = await Promise.all((await TransactionRepository.getAll()).map( async transaction => {
            return new Promise(async resolve => {
                resolve({
                    transactionId : transaction.id,
                    items : await Promise.all(transaction.entries.map(async item => {
                        return {
                            quantity : item.quantity,
                            id : await ItemRepository.getByItemCode(item.itemId)
                        }
                    })),
                    transactionType: transaction.transactionType,
                    transactionUser: transaction.userOwner.firstName + ' ' + transaction.userOwner.lastName
                });
            })
        }));



        res.render("partials/report",{
            transactions: k
        });
    });


    router.get("/help", async function(req, res){
    res.render("pages/help");
    });
    
    return router;

});
