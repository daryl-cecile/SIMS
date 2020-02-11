import {RouterSet} from "../../config/RouterSet";

export const TransactionController = new RouterSet( (router) => {

    router.get("/confirm", async function(req, res){
        res.render("pages/confirm_transaction");
    });

    router.get("/report", async function(req, res){
        res.render("partials/report");
    });

    return router;

});
