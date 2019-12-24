const home = require('express').Router();
home.get("/", async function (req, res) {
    res.render("pages/index");
});
home.get("/login", async function (req, res) {
    res.redirect("/login/user");
});
home.get("/login/user", async function (req, res) {
    res.render("pages/login");
});
home.get("/login/staff", async function (req, res) {
    res.render("pages/admin-login");
});
module.exports = home;
//# sourceMappingURL=base.js.map