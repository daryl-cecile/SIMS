import {Passport} from "../../Services/Passport";

const loginController = require('express').Router();

loginController.post("/login/staff", async function (req, res) {

    let username = req.body['username'];    // set using form data
    let password = req.body['password'];    // set using form data

    let result = await Passport.authenticate(username, password, req, res);

    res. json( result.object );
    res.end();

});

loginController.post("/login/customer", async function(req, res){

    let username = req.body['username'];

    let result = await Passport.authenticateCustomer(username,req, res);

    res.json( result.object );
    res.end();

});

module.exports = loginController;