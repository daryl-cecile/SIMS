import {StaffModel} from "../models/StaffModel";
import {UserModel} from "../models/UserModel";

const apis = require('express').Router();
const db = require("./../config/DBConnection");

apis.post("/login", async function (req, res) {

    let username = req.body['username'];    // set using form data
    let password = req.body['password'];    // set using form data

    res.end();

});

apis.get('/list/users', async function(req, res){

    let userRepo = db.connection.getRepository(UserModel);

    let finalList = {};

    (await userRepo.find()).forEach((user) => {
        finalList[ user.email ] = user.identifier;
    });

    res.write(JSON.stringify(finalList));
    res.end();

});

apis.get('/list/staffs', async function(req, res){

    let staffRepo = db.connection.getRepository(StaffModel);

    let finalList = {};

    (await staffRepo.find()).forEach((staff) => {
        finalList[ staff.email ] = staff.identifier;
    });

    res.write(JSON.stringify(finalList));
    res.end();

});

module.exports = apis;