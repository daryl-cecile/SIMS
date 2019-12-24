"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StaffModel_1 = require("../models/StaffModel");
const JSONResponse_1 = require("./JSONResponse");
const SessionModel_1 = require("../models/SessionModel");
const Crypto = require("crypto");
const db = require("./DBConnection");
const Cookies = require("cookies");
const uuid = require("uuid/v4");
var Passport;
(function (Passport) {
    async function isCredentialsValid(username, password) {
        let hashedPassword = this.hashPassword(password);
        let staffRepo = db.connection.getRepository(StaffModel_1.StaffModel);
        let staff = await staffRepo.findOne({ where: username });
        if (staff === undefined) {
            return new JSONResponse_1.JSONResp(false, "Incorrect username or password", {
                username: username
            });
        }
        if (staff.passHash === hashedPassword) {
            return new JSONResponse_1.JSONResp(true);
        }
    }
    Passport.isCredentialsValid = isCredentialsValid;
    function hashPassword(password) {
        let firstRound = Crypto.createHash("sha256").update(password).digest();
        let secondRound = Crypto.createHash("sha256").update(firstRound).digest();
        return Crypto.createHash("sha256").update(secondRound).digest();
    }
    Passport.hashPassword = hashPassword;
    async function authenticate(username, password, req, res) {
        let cookies = new Cookies(req, res, { keys: ["_SIMS_PASSPORT_KEY_"] });
        let result = this.isCredentialsValid(username, password);
        let staffRepo = db.connection.getRepository(StaffModel_1.StaffModel);
        let sessionRepo = db.connection.getRepository(SessionModel_1.SessionModel);
        let acc = await staffRepo.findOne({ where: { username }, relations: ['currentSession'] });
        let sesh = acc.currentSession;
        if (sesh) {
            sesh.invalid = true;
            await sessionRepo.save(sesh);
        }
        if (result.object.isSuccessful) {
            sesh = new SessionModel_1.SessionModel();
            sesh.expiry = new Date(Date.now() + (30 * 60 * 1000));
            sesh.sessionKey = uuid();
            acc.currentSession = sesh;
            await staffRepo.save(acc);
            cookies.set("_passport", sesh.sessionKey, { signed: true });
            return new JSONResponse_1.JSONResp(true, "Success", {
                token: sesh.sessionKey
            });
        }
        else {
            return result;
        }
    }
    Passport.authenticate = authenticate;
    async function isAuthenticated(req, res) {
        let cookies = new Cookies(req, res, { keys: ["_SIMS_PASSPORT_KEY_"] });
        let passportToken = cookies.get("_passport", { signed: true });
        if (passportToken) {
            let sessionRepo = db.connection.getRepository(SessionModel_1.SessionModel);
            let session = await sessionRepo.findOne({ where: { sessionKey: passportToken }, relations: ['owner'] });
            if (session && session.IsValid) {
                return new JSONResponse_1.JSONResp(true, "Authenticated", { user: session.owner });
            }
            return new JSONResponse_1.JSONResp(false);
        }
        else {
            return new JSONResponse_1.JSONResp(false);
        }
    }
    Passport.isAuthenticated = isAuthenticated;
})(Passport = exports.Passport || (exports.Passport = {}));
//# sourceMappingURL=Passport.js.map