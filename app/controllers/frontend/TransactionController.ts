import {RouterSet} from "../../config/RouterSet";
import {TransactionRepository} from "../../Repository/TransactionRepository";
import {ItemRepository} from "../../Repository/ItemRepository";
import {TransactionType} from "../../models/TransactionsModel";
import {Passport} from "../../Services/Passport";

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

    router.get("/report/framed/transaction", async function(req, res){
        res = await Passport.MakeAdminAccessOnly("Transaction Report", res);
        let transactions = await TransactionRepository.getAll();
        let currentUser = await Passport.getCurrentUser(req, res);
        res.render("partials/report",{
            transactions : await Promise.all(transactions.map(async transaction => {
                let m:any = {};
                m.items = await Promise.all(transaction.entries.map(async entry => {
                    let item = await ItemRepository.getByItemCode(entry.itemId);
                    return {
                        name : item.name,
                        count: entry.quantity
                    }
                }));
                m.transactionId = transaction.id;
                m.transactionOwner = transaction.userOwner.identifier;
                m.transactionType = TransactionType[transaction.transactionType];
                m.transactionDate = transaction.createdAt;
                return m;
            })),
            currentUserName : `${currentUser.firstName} ${currentUser.lastName}`,
            currentUserId : currentUser.identifier
        });
    });

    router.get("/report/framed/inventory", async function(req, res){
        res = await Passport.MakeAdminAccessOnly("Inventory Report", res);
        let items = await ItemRepository.getAll();
        res.render("partials/report_inventory",{
            genDate: new Date(),
            items : items.map(item => {
                return {
                    itemId : item.id,
                    name : item.name,
                    unitCount : item.unitCount,
                    quantity : item.quantity,
                    description : item.description
                }
            })
        });
    });

    router.get("/report/transactions", async function(req, res){
        res = await Passport.MakeAdminAccessOnly("Transaction Report", res);
        res.render("pages/report_viewer",{
            type : "transaction"
        });
    });

    router.get("/report/inventory", async function(req, res){
        res = await Passport.MakeAdminAccessOnly("Inventory Report", res);
        res.render("pages/report_viewer",{
            type : "inventory"
        });
    });

    router.get("/help", async function(req, res){
        res.render("pages/help");
    });
    
    return router;

});
