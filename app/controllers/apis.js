const apis = require('express').Router();
apis.post("/login", async function (req, res) {
    let username = req.body['username'];
    let password = req.body['password'];
    res.end();
});
apis.get('/user_info/:username', async function (req, res) {
    let username = req.params['username'];
    res.end();
});
module.exports = apis;
//# sourceMappingURL=apis.js.map