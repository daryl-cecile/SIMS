import {UserService} from "../../Services/UserService";

const userController = require('express').Router();

userController.get('/user/list', async function(req, res){

    let term = (req.query['hint'] || "=").toLowerCase();

    if (term.length < 1) {
        res.end();
        return;
    }

    let finalList = (await UserService.getAllCustomers()).filter((user) => {
        return ( user.email.toLowerCase().startsWith(term) || user.identifier.toLowerCase().indexOf(term) > -1 )
    }).map(user => user.toJSON());

    res.json(finalList);
    res.end();
});

module.exports = userController;