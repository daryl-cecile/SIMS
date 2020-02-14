import {RouterSet} from "../../config/RouterSet";
import {TransactionRepository} from "../../Repository/TransactionRepository";
import {ItemRepository} from "../../Repository/ItemRepository";

export const TransactionController = new RouterSet( (router) => {

    router.get("/confirm/:transaction_id", async function(req, res){
        let transactionId = req.params['transaction_id'];
        let transaction = await TransactionRepository.getById(parseInt(transactionId ?? "-3"));
        if (transaction === null){
            res.status(404);
            res.send('Could not find transaction');
        }
        else{
            res.render("pages/confirm_transaction",{
                items: await Promise.all(transaction.entries.map(entry => {
                    return new Promise(async resolve => {
                        let k = await ItemRepository.getByItemCode(entry.itemId);
                        resolve({
                            name : k.name,
                            quantity : entry.quantity
                        });
                    })
                })),
                transactionId: transaction
            });
        }
    });

    router.get("/report", async function(req, res){
        res.render("partials/report");
    });

    router.get("/help", async function(req, res){
        res.render("pages/help");
    });
    
    return router;

});
