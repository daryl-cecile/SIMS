import {Passport} from "../../Services/Passport";
import {UserService} from "../../Services/UserService";
import {RouterSet} from "../../config/RouterSet";
import {FSManager} from "../../config/FSManager";

export const LoginController = new RouterSet( (router) => {

    router.get("/", async function (req, res) {
        // default POS page

        let authCheck = await Passport.isAuthenticated(req, res);
        if (authCheck.object.isSuccessful){

            let acc = authCheck.object.payload['user'];

            if ( await UserService.hasPermission(acc, "MANAGE") ){
                res.render("pages/manage", { user: acc });
            }
            else{
                res.render("pages/pos", { user: acc });
            }

        }
        else{
            res.redirect("/login");
        }

    });

    router.get("/login", async function(req, res){
        res.redirect("/login/user"); // redirect to user-mode login
    });

    router.get("/login/user", async function(req, res){
        res.render("pages/login"); // user-mode login
    });

    router.get("/login/staff", async function(req, res){
        res.render("pages/admin-login"); // admin-mode login
    });

    router.get("/logout", async function(req, res){
        await Passport.voidSession(req, res);
        res.redirect("/");
    });

    router.get("/test", async function(req, res){
        console.log( FSManager.getIncomingFiles() );
        console.log( req.body['namef'] );
        res.write("DONE");
        res.end();
    });

    return router;

});



