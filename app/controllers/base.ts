const home = require('express').Router();

home.get("/", async function (req, res) {
    res.render("pages/index");
});

home.get("/login", async function(req,res){
    res.redirect("/login/user"); // redirect to user-mode login
});

home.get("/login/user", async function(req,res){
    res.render("pages/login"); // user-mode login
});

home.get("/login/manage", async function(req,res){
    res.render("pages/admin-login"); // admin-mode login
});

module.exports = home;