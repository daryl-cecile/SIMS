import {SystemLogEntryModel} from "../models/SystemLogEntryModel";
import {SystemLogRepository} from "../Repository/SystemLogRepository";
import {XError} from "./XError";


export namespace System{

    const backlog:SystemLogEntryModel[] = [];
    let interval = null;
    let isProd:boolean = null;

    export const InstanceId = require("crypto").randomBytes(12).toString('hex');

    export function isProduction(){
        // check if .env file exists; if so, we are running dev mode, otherwise prod
        if (isProd === null) isProd = (require("fs").existsSync("./.env") === false);
        return isProd;
    }

    export enum ERRORS{
        UNKNOWN = 0x99,
        DB_BOOT = 0x02,
        APP_BOOT= 0x01,
        NORMAL = 0x00
    }

    export async function err(err:Error,errcode?:System.ERRORS,extraInfo?:string){
        let e = XError.createFrom(err);
        let rSF = e.stackFrames[0];
        let message = e.message;

        if (extraInfo) message += "\n\n\t" + extraInfo;

        return await System.log(e.type, `${rSF.fileName}:${rSF.lineNumber}:${rSF.columnNumber}\n\t${message}`, errcode);
    }

    export async function log(title:string, message:string, errCode?:System.ERRORS){

        if (!errCode) errCode = System.ERRORS.NORMAL;
        let err_code_normalized = System.ERRORS[errCode];

        if (System.isProduction()){
            let entry = new SystemLogEntryModel();
            entry.title = title;
            entry.message = message;
            entry.errorCode = err_code_normalized;
            entry.reference = System.InstanceId;

            if (backlog.length > 0 || SystemLogRepository.isConnectionReady() === false){
                pushToBacklog(entry);
            }
            else{
                await SystemLogRepository.save(entry);
            }
        }
        else{
            console.group("System Log");
            console.log("Title: " + title);
            console.log("Message: " + message);
            console.log("ErrCode: " + err_code_normalized);
            console.log("");
            console.groupEnd();
        }
    }

    function pushToBacklog(logEntry:SystemLogEntryModel){

        backlog.push(logEntry);

        if (backlog.length !== 0 && interval === null){
            interval = setInterval(async ()=>{
                if ( SystemLogRepository.isConnectionReady() ){
                    clearInterval(interval);
                    interval = null;
                    while (backlog.length > 0){
                        let entry = backlog.shift();
                        await SystemLogRepository.save(entry);
                    }
                }
            },500);
        }

    }
}