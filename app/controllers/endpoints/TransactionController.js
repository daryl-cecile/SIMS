"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Passport_1 = require("../../Services/Passport");
const TransactionsModel_1 = require("../../models/TransactionsModel");
const TransactionRepository_1 = require("../../Repository/TransactionRepository");
const JSONResponse_1 = require("../../config/JSONResponse");
const RouterSet_1 = require("../../config/RouterSet");
const TransactionService_1 = require("../../Services/TransactionService");
exports.TransactionsEndpointController = new RouterSet_1.RouterSet((router) => {
    router.post("/transactions/issue", async function (req, res) {
        let currentUser = await Passport_1.Passport.getCurrentUser(req, res);
        if (currentUser != undefined) {
            let purchasedItems = await TransactionService_1.TransactionService.parsePurchasedItems(req);
            let tempTransaction = new TransactionsModel_1.TransactionsModel();
            tempTransaction.userOwner = currentUser;
            await TransactionService_1.TransactionService.handlePurchase(tempTransaction, purchasedItems, currentUser);
            res.json((new JSONResponse_1.JSONResp(true, "Transaction successfully added")).object);
        }
        else
            res.json((new JSONResponse_1.JSONResp(false)).object);
    });
    router.post("/transactions/refund", async function (req, res) {
        let { transactionsCode, itemsToRefund } = await TransactionService_1.TransactionService.parseRefundItems(req);
        let tempTransaction = await TransactionRepository_1.TransactionRepository.getByItemCode(transactionsCode);
        await TransactionService_1.TransactionService.handleRefund(tempTransaction, itemsToRefund);
        res.json(new JSONResponse_1.JSONResp(true, "Refund successful").object);
    });
    router.get("/transactions/list", async function (req, res) {
        let currentUser = await Passport_1.Passport.getCurrentUser(req, res);
        let userTransactions = currentUser.transactions;
        res.json(JSONResponse_1.JSONResponse(true, "transactionRecord", userTransactions));
    });
    return router;
});
//# sourceMappingURL=TransactionController.js.map