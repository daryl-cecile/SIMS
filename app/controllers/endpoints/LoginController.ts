import {Passport} from "../../Services/Passport";
import {RouterSet} from "../../config/RouterSet";

export const LoginEndpointController = new RouterSet((router)=>{

    router.post("/login/staff", async function (req, res) {

        let username = req.body['username'];    // set using form data
        let password = req.body['password'];    // set using form data

        let result = await Passport.authenticate(username, password, req, res);

        res. json( result.object );
        res.end();

    });

    router.post("/login/customer", async function(req, res){

        let username = req.body['username'];

        let result = await Passport.authenticateCustomer(username,req, res);

        res.json( result.object );
        res.end();

    });

    return router;
});


