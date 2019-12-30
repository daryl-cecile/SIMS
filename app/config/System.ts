import {SystemLogEntryModel} from "../models/SystemLogEntryModel";
import {SystemLogRepository} from "../Repository/SystemLogRepository";
import {XError} from "./XError";

const eventManager = require('./GlobalEvents');

export namespace System{

    const backlog:SystemLogEntryModel[] = [];
    let interval = null;
    let isProd:boolean = null;
    let ignoreOutput:boolean = false;

    export const InstanceId = require("crypto").randomBytes(12).toString('hex');

    export function isProduction(){
        // check if .env file exists; if so, we are running dev mode, otherwise prod
        if (isProd === null) isProd = (require("fs").existsSync("./.env") === false);
        return isProd;
    }

    export enum ERRORS{
        UNKNOWN = 0x99,
        CALLBACK_ERR = 0x05,
        SIGNAL_ERR = 0x03,
        DB_BOOT = 0x02,
        APP_BOOT= 0x01,
        NORMAL = 0x00,
        NONE = 0x00
    }

    export async function fatal(err:Error, errcode?:System.ERRORS, extraInfo?:string){
        await System.error(err, errcode, extraInfo);
        attemptSafeTerminate();
    }

    export async function error(err:Error,errcode?:System.ERRORS,extraInfo?:string){
        let e = XError.createFrom(err);
        let rSF = e.stackFrames[0];
        let message = e.message;

        if (extraInfo) message += "\n\n\t" + extraInfo;

        await System.log(e.type, `${rSF.fileName}:${rSF.lineNumber}:${rSF.columnNumber}\n\t${message}`, errcode);
    }

    export async function log(title:string, message:string, errCode?:System.ERRORS){

        if (ignoreOutput) return;

        if (!errCode) errCode = System.ERRORS.NONE;
        let err_code_normalized = System.ERRORS[errCode];

        if (System.isProduction()){
            let entry = new SystemLogEntryModel();
            entry.title = title;
            entry.message = message;
            entry.errorCode = err_code_normalized;
            entry.reference = System.InstanceId;

            if ( backlog.length > 0 || SystemLogRepository.isConnectionReady() === false ){
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

    export function AutoErrorHandler(err , optionalExtraInfo?:string, callback?:Function){
        if (err){
            System.error(err, ERRORS.CALLBACK_ERR ,optionalExtraInfo);
        }
        if (callback) callback(err);
    }

    export function haltOutput(){
        ignoreOutput = true;
    }

    export function releaseOutput(){
        ignoreOutput = false;
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

    function flushBacklog(){
        while (backlog.length > 0){
            let entry = backlog.shift();
            console.group("System Log Flush");
            console.log("Title: " + entry.title);
            console.log("Message: " + entry.message);
            console.log("ErrCode: " + entry.errorCode);
            console.log("");
            console.groupEnd();
        }
    }

    function signal(code:string){
        return err => {
            if (err) System.error(err, ERRORS.SIGNAL_ERR, "Signal received with error");
            else System.log("Signal", code, ERRORS.NONE);
            System.attemptSafeTerminate();
        }
    }

    export function attemptSafeTerminate(){
        System.log("Status","Attempting safe terminate");
        let eventManager = require("./GlobalEvents");

        if (backlog.length > 0) flushBacklog(); // flushes backlog into stdout

        let timeout = setTimeout(()=>{ // give app 5s to respond to shutdown request
            process.exit(1); // app took too long to comply with shutdown request, force shutdown
        },5000).unref();

        eventManager.listen("UNLOAD", ()=>{ // wait for app shutdown response
            clearTimeout(timeout);
        },{ singleUse: true });

        eventManager.trigger("TERMINATE"); // tell app to shutdown
    }

    export function attachTerminateListeners(db, server){

        // catch app level errors in case
        process.on("uncaughtException",err => {
            System.fatal(err, System.ERRORS.APP_BOOT,"uncaughtException");
        });

        // catch heroku shutdown requests
        process.on("SIGTERM", signal("SIGTERM"));
        process.on("SIGINT", signal("SIGINT"));

        // listen for terminate events and gracefully release resources
        eventManager.listen("TERMINATE", ()=>{
            db.end().then(()=>{
                server.close(()=>{
                    eventManager.trigger("UNLOAD");
                });
            }).catch(x => {
                console.error(x);
                process.exit(1); //couldnt end the connection so force exit
            });
        },{ singleUse: true });

    }
}