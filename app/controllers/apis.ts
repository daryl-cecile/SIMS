import {Passport} from "../Services/Passport";
import {UserService} from "../Services/UserService";

const apis = require('express').Router();

apis.post("/login/staff", async function (req, res) {

    let username = req.body['username'];    // set using form data
    let password = req.body['password'];    // set using form data

    let result = await Passport.authenticate(username, password, req, res);

    res. json( result.object );
    res.end();

});

apis.post("/login/customer", async function(req, res){

    let username = req.body['username'];

    let result = await Passport.authenticateCustomer(username,req, res);

    res.json( result.object );
    res.end();

});

apis.get('/list/users', async function(req, res){

    let term = (req.query['hint'] || "=").toLowerCase();

    if (term.length < 1) {
        res.end();
        return;
    }

    let finalList = {};

    (await UserService.getAllCustomers()).forEach((user) => {
        if ( user.email.toLowerCase().startsWith(term) || user.identifier.toLowerCase().indexOf(term) > -1 )
            finalList[ user.email ] = user.identifier;
    });

    res.json(finalList);
    res.end();

});

module.exports = apis;