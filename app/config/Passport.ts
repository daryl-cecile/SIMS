import {StaffModel} from "../models/StaffModel";
import {JSONResp} from "./JSONResponse";
import {SessionModel} from "../models/SessionModel";

const Crypto = require("crypto");
const db = require("./DBConnection");
const Cookies = require("cookies");
const uuid = require("uuid/v4");

export namespace Passport{

    export async function isCredentialsValid(username:string, password:string){
        let hashedPassword = this.hashPassword(password);
        let staffRepo = db.connection.getRepository(StaffModel);

        let staff = await staffRepo.findOne({ where: username });

        if (staff === undefined){
            return new JSONResp(false,"Incorrect username or password",{
                username: username
            });
        }

        if ( staff.passHash === hashedPassword ){
            return new JSONResp(true);
        }
    }

    export function hashPassword(password:string){
        let firstRound = Crypto.createHash("sha256").update(password).digest();
        let secondRound = Crypto.createHash("sha256").update(firstRound).digest()
        return Crypto.createHash("sha256").update(secondRound).digest()
    }

    export async function authenticate(username:string, password:string, req, res){

        let cookies = new Cookies(req, res, { keys: ["_SIMS_PASSPORT_KEY_"] });
        let result:JSONResp = this.isCredentialsValid(username,password);
        let staffRepo = db.connection.getRepository(StaffModel);
        let sessionRepo = db.connection.getRepository(SessionModel);

        let acc = await staffRepo.findOne({ where: { username }, relations: ['currentSession'] });
        let sesh = acc.currentSession;

        if (sesh){
            sesh.invalid = true;
            await sessionRepo.save(sesh);
        }

        if (result.object.isSuccessful){

            sesh = new SessionModel();
            sesh.expiry = new Date( Date.now() + (30 * 60 * 1000) );
            sesh.sessionKey = uuid();

            acc.currentSession = sesh;
            await staffRepo.save(acc);

            cookies.set("_passport", sesh.sessionKey,{signed:true});

            return new JSONResp(true, "Success", {
                token: sesh.sessionKey
            });

        }
        else{
            return result;
        }

    }

    export async function isAuthenticated(req, res){

        let cookies = new Cookies(req, res, { keys: ["_SIMS_PASSPORT_KEY_"] });
        let passportToken = cookies.get("_passport",{ signed: true });

        if (passportToken){
            let sessionRepo = db.connection.getRepository(SessionModel);
            let session = await sessionRepo.findOne({ where: {sessionKey:passportToken}, relations: ['owner'] });

            if (session && session.IsValid){
                return new JSONResp(true,"Authenticated",{ user: session.owner });
            }
            return new JSONResp(false);
        }
        else{
            return new JSONResp(false);
        }

    }

}