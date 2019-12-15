const home = require('express').Router();
home.get("/", async function (req, res) {
    res.render("pages/index");
});
home.get("/a", async function (req, res) {
    res.send("Hello World");
});
home.get("/b", async function (req, res) {
    res.write("Hello,");
    res.write("World");
    res.end();
});
module.exports = home;
//# sourceMappingURL=base.js.map