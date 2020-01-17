"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSONResponse_1 = require("../config/JSONResponse");
const SessionModel_1 = require("../models/SessionModel");
const UserRepository_1 = require("../Repository/UserRepository");
const SessionRepository_1 = require("../Repository/SessionRepository");
const TimeHelper_1 = require("../config/TimeHelper");
const PermissionRepository_1 = require("../Repository/PermissionRepository");
const UserService_1 = require("./UserService");
const System_1 = require("../config/System");
const Crypto = require("crypto");
const uuid = require("uuid/v4");
var Passport;
(function (Passport) {
    function createSaltine() {
        let salt = Crypto.createHash("sha256").update(Crypto.randomBytes(128)).digest('hex');
        let iter = Math.random() * (32 - 8) + 8;
        return `${salt}::${iter}`;
    }
    Passport.createSaltine = createSaltine;
    async function hashPassword(password, saltine) {
        return new Promise(resolve => {
            let salt = saltine.split("::")[0];
            let iter = parseInt(saltine.split("::")[1]);
            if (iter < 0 || iter > 32)
                iter = 16;
            Crypto.scrypt(password, salt, 64, (err, key) => {
                let k = key.toString('hex');
                while (iter > 0) {
                    k = Crypto.createHash("sha256").update(k).digest('hex');
                    iter--;
                }
                resolve(k);
            });
        });
    }
    Passport.hashPassword = hashPassword;
    async function authenticate(username, password, req, res) {
        let result = await this.isStaffCredentialsValid(username, password);
        let acc = await UserRepository_1.UserRepository.getUserByIdentifier(username);
        if (acc === undefined)
            return result;
        let sesh = acc.currentSession;
        if (sesh) {
            sesh.invalid = true;
            await SessionRepository_1.SessionRepository.save(sesh);
        }
        if (result.object.isSuccessful) {
            sesh = new SessionModel_1.SessionModel();
            sesh.expiry = TimeHelper_1.TimeHelper.minutesFromNow(30);
            sesh.sessionKey = uuid();
            sesh.invalid = false;
            acc.currentSession = sesh;
            await UserRepository_1.UserRepository.save(acc);
            System_1.System.cookieStore.set("_passport", sesh.sessionKey, { expires: sesh.expiry });
            return new JSONResponse_1.JSONResp(true, "Success", {
                token: sesh.sessionKey
            });
        }
        else {
            return result;
        }
    }
    Passport.authenticate = authenticate;
    async function authenticateCustomer(usernameOrEmail, req, res) {
        let account = await UserRepository_1.UserRepository.getUserByIdentifierOrEmail(usernameOrEmail);
        if (account !== undefined) {
            if (await UserService_1.UserService.isUserStaffMember(account) === true) {
                return new JSONResponse_1.JSONResp(false, "Password missing", "A password is required for this account");
            }
            let session = new SessionModel_1.SessionModel();
            session.expiry = TimeHelper_1.TimeHelper.minutesFromNow(10);
            session.sessionKey = uuid();
            session.invalid = false;
            account.currentSession = session;
            await UserRepository_1.UserRepository.save(account);
            await SessionRepository_1.SessionRepository.save(session);
            System_1.System.cookieStore.set("_passport", session.sessionKey, { expires: session.expiry });
            return new JSONResponse_1.JSONResp(true, "Success", {
                token: session.sessionKey
            });
        }
        return new JSONResponse_1.JSONResp(false, "Account not found", "No accounts are registered with that username or email");
    }
    Passport.authenticateCustomer = authenticateCustomer;
    async function isStaffCredentialsValid(username, password) {
        let user = await UserRepository_1.UserRepository.getUserByIdentifier(username);
        if (user === undefined) {
            return new JSONResponse_1.JSONResp(false, "Incorrect username", "No users with that username was found", {
                username: username
            });
        }
        let hashedPassword = await this.hashPassword(password, user.saltine);
        if (user.passHash === hashedPassword) {
            if (user.permissions.indexOf(await PermissionRepository_1.PermissionRepository.getPermissionByName("STAFF")) > -1) {
                return new JSONResponse_1.JSONResp(false, "Unauthorized", "This account does not have the required 'STAFF' permission");
            }
            return new JSONResponse_1.JSONResp(true);
        }
        return new JSONResponse_1.JSONResp(false, "Incorrect password", "Password incorrect. Please try again");
    }
    Passport.isStaffCredentialsValid = isStaffCredentialsValid;
    async function isAuthenticated(req, res) {
        let passportToken = System_1.System.cookieStore.get("_passport");
        if (passportToken) {
            let session = await SessionRepository_1.SessionRepository.getBySessionKey(passportToken);
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
    async function voidSession(req, res) {
        let authCheck = await this.isAuthenticated(req, res);
        if (authCheck.object.isSuccessful) {
            let user = authCheck.object.payload['user'];
            user.currentSession.invalid = true;
            await SessionRepository_1.SessionRepository.save(user.currentSession);
        }
    }
    Passport.voidSession = voidSession;
})(Passport = exports.Passport || (exports.Passport = {}));
module.exports.default = Passport;
//# sourceMappingURL=Passport.js.map