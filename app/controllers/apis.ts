const apis = require('express').Router();

apis.post("/login", async function (req, res) {

    let username = req.body['username'];    // set using form data
    let password = req.body['password'];    // set using form data

    res.end();

});

apis.get('/user_info/:username', async function(req, res){

    let username = req.params['username'];   // set using the url variable

    res.end();

});

module.exports = apis;