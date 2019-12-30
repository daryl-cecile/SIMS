import {JSONResp} from "../config/JSONResponse";
import {SessionModel} from "../models/SessionModel";
import {UserModel} from "../models/UserModel";
import {UserRepository} from "../Repository/UserRepository";
import {SessionRepository} from "../Repository/SessionRepository";
import {TimeHelper} from "../config/TimeHelper";
import {PermissionRepository} from "../Repository/PermissionRepository";
import {UserService} from "./UserService";
import {System} from "../config/System";

const Crypto = require("crypto");
const uuid = require("uuid/v4");

export namespace Passport{

    export function createSaltine(){
        let salt = Crypto.createHash("sha256").update(Crypto.randomBytes(128)).digest('hex');
        let iter = Math.random() * (32 - 8) + 8; // min 8 max 32
        return `${salt}::${iter}`;
    }

    export async function hashPassword(password:string,saltine?:string){
        return new Promise<string>(resolve => {

            let salt:string = saltine.split("::")[0];
            let iter:number = parseInt(saltine.split("::")[1]);

            if (iter < 0 || iter > 32) iter = 16;

            Crypto.scrypt(password, salt, 64, (err, key)=>{
                let k = key.toString('hex');
                while (iter > 0){
                    k = Crypto.createHash("sha256").update(k).digest('hex');
                    iter --;
                }
                resolve(k);
            });

        });
    }

    export async function authenticate(username:string, password:string, req, res){

        let result:JSONResp = await this.isStaffCredentialsValid(username,password);

        let acc = await UserRepository.getUserByIdentifier(username);

        if (acc === undefined) return result;

        let sesh = acc.currentSession;

        if (sesh){
            sesh.invalid = true;
            await SessionRepository.save(sesh);
        }

        if (result.object.isSuccessful){

            sesh = new SessionModel();
            sesh.expiry = TimeHelper.minutesFromNow(30);
            sesh.sessionKey = uuid();
            sesh.invalid = false;

            acc.currentSession = sesh;
            await UserRepository.save(acc);

            System.cookieStore.set("_passport", sesh.sessionKey,{expires: sesh.expiry});

            return new JSONResp(true, "Success", {
                token: sesh.sessionKey
            });

        }
        else{
            return result;
        }

    }

    export async function authenticateCustomer(usernameOrEmail:string, req, res){

        let account = await UserRepository.getUserByIdentifierOrEmail(usernameOrEmail);

        if (account !== undefined){

            if ( await UserService.isUserStaffMember(account) === true ){
                return new JSONResp(false, "Password missing", "A password is required for this account");
            }

            let session = new SessionModel();
            session.expiry = TimeHelper.minutesFromNow(10);
            session.sessionKey = uuid();
            session.invalid = false;

            account.currentSession = session;
            await UserRepository.save(account);
            await SessionRepository.save(session);

            System.cookieStore.set("_passport", session.sessionKey,{expires: session.expiry});

            return new JSONResp(true, "Success", {
                token: session.sessionKey
            });
        }
        return new JSONResp(false, "Account not found", "No accounts are registered with that username or email");

    }

    export async function isStaffCredentialsValid(username:string, password:string){
        let user = await UserRepository.getUserByIdentifier(username);

        if (user === undefined){
            return new JSONResp(false,"Incorrect username or password",{
                username: username
            });
        }

        let hashedPassword = await this.hashPassword(password, user.saltine);
        if ( user.passHash === hashedPassword ){
            if ( user.permissions.indexOf( await PermissionRepository.getPermissionByName("STAFF") ) > -1 ){
                return new JSONResp(false, "Unauthorized", "This account does not have the required 'STAFF' permission");
            }
            return new JSONResp(true);
        }
        return new JSONResp(false, "Incorrect password", "Password incorrect. Please try again");
    }

    export async function isAuthenticated(req, res){

        let passportToken = System.cookieStore.get("_passport");

        if (passportToken){
            let session = await SessionRepository.getBySessionKey(passportToken);

            if (session && session.IsValid){
                return new JSONResp(true,"Authenticated",{ user: session.owner });
            }
            return new JSONResp(false);
        }
        else{
            return new JSONResp(false);
        }

    }

    export async function voidSession(req, res){

        let authCheck = await this.isAuthenticated(req, res);

        if (authCheck.object.isSuccessful){

            // user is authenticated, void session

            let user:UserModel = authCheck.object.payload['user'];
            user.currentSession.invalid = true;
            await SessionRepository.save(user.currentSession);

        }

    }

}

module.exports.default = Passport; // for tests