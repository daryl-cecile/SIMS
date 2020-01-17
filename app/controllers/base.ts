import {Passport} from "../Services/Passport";
import {UserModel} from "../models/UserModel";
import {UserService} from "../Services/UserService";

const home = require('express').Router();


home.get("/", async function (req, res) {
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

home.get("/login", async function(req,res){
    res.redirect("/login/user"); // redirect to user-mode login
});

home.get("/login/user", async function(req,res){
    res.render("pages/login"); // user-mode login
});

home.get("/login/staff", async function(req,res){
    res.render("pages/admin-login"); // admin-mode login
});

home.get("/logout", async function(req, res){
    await Passport.voidSession(req, res);
    res.redirect("/");
});

home.get("/confirm", async function(req, res){
    res.render("pages/confirm_transaction");
});

module.exports = home;