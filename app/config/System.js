"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SystemLogEntryModel_1 = require("../models/SystemLogEntryModel");
const SystemLogRepository_1 = require("../Repository/SystemLogRepository");
const XError_1 = require("./XError");
const eventManager = require('./GlobalEvents');
var System;
(function (System) {
    const backlog = [];
    let interval = null;
    let isProd = null;
    let ignoreOutput = false;
    System.InstanceId = require("crypto").randomBytes(12).toString('hex');
    function isProduction() {
        if (isProd === null)
            isProd = (require("fs").existsSync("./.env") === false);
        return isProd;
    }
    System.isProduction = isProduction;
    let ERRORS;
    (function (ERRORS) {
        ERRORS[ERRORS["UNKNOWN"] = 153] = "UNKNOWN";
        ERRORS[ERRORS["CALLBACK_ERR"] = 5] = "CALLBACK_ERR";
        ERRORS[ERRORS["SIGNAL_ERR"] = 3] = "SIGNAL_ERR";
        ERRORS[ERRORS["DB_BOOT"] = 2] = "DB_BOOT";
        ERRORS[ERRORS["APP_BOOT"] = 1] = "APP_BOOT";
        ERRORS[ERRORS["NORMAL"] = 0] = "NORMAL";
        ERRORS[ERRORS["NONE"] = 0] = "NONE";
    })(ERRORS = System.ERRORS || (System.ERRORS = {}));
    async function fatal(err, errcode, extraInfo) {
        await System.error(err, errcode, extraInfo);
        attemptSafeTerminate();
    }
    System.fatal = fatal;
    async function error(err, errcode, extraInfo) {
        let e = XError_1.XError.createFrom(err);
        let rSF = e.stackFrames[0];
        let message = e.message;
        if (extraInfo)
            message += "\n\n\t" + extraInfo;
        await System.log(e.type, `${rSF.fileName}:${rSF.lineNumber}:${rSF.columnNumber}\n\t${message}`, errcode);
    }
    System.error = error;
    async function log(title, message, errCode) {
        if (ignoreOutput)
            return;
        if (!errCode)
            errCode = System.ERRORS.NONE;
        let err_code_normalized = System.ERRORS[errCode];
        if (System.isProduction()) {
            let entry = new SystemLogEntryModel_1.SystemLogEntryModel();
            entry.title = title;
            entry.message = message;
            entry.errorCode = err_code_normalized;
            entry.reference = System.InstanceId;
            if (backlog.length > 0 || SystemLogRepository_1.SystemLogRepository.isConnectionReady() === false) {
                pushToBacklog(entry);
            }
            else {
                await SystemLogRepository_1.SystemLogRepository.save(entry);
            }
        }
        else {
            console.group("System Log");
            console.log("Title: " + title);
            console.log("Message: " + message);
            console.log("ErrCode: " + err_code_normalized);
            console.log("");
            console.groupEnd();
        }
    }
    System.log = log;
    function AutoErrorHandler(err, optionalExtraInfo, callback) {
        if (err) {
            System.error(err, ERRORS.CALLBACK_ERR, optionalExtraInfo);
        }
        if (callback)
            callback(err);
    }
    System.AutoErrorHandler = AutoErrorHandler;
    function haltOutput() {
        ignoreOutput = true;
    }
    System.haltOutput = haltOutput;
    function releaseOutput() {
        ignoreOutput = false;
    }
    System.releaseOutput = releaseOutput;
    function pushToBacklog(logEntry) {
        backlog.push(logEntry);
        if (backlog.length !== 0 && interval === null) {
            interval = setInterval(async () => {
                if (SystemLogRepository_1.SystemLogRepository.isConnectionReady()) {
                    clearInterval(interval);
                    interval = null;
                    while (backlog.length > 0) {
                        let entry = backlog.shift();
                        await SystemLogRepository_1.SystemLogRepository.save(entry);
                    }
                }
            }, 500);
        }
    }
    function flushBacklog() {
        while (backlog.length > 0) {
            let entry = backlog.shift();
            console.group("System Log Flush");
            console.log("Title: " + entry.title);
            console.log("Message: " + entry.message);
            console.log("ErrCode: " + entry.errorCode);
            console.log("");
            console.groupEnd();
        }
    }
    function signal(code) {
        return err => {
            if (err)
                System.error(err, ERRORS.SIGNAL_ERR, "Signal received with error");
            else
                System.log("Signal", code, ERRORS.NONE);
            System.attemptSafeTerminate();
        };
    }
    function attemptSafeTerminate() {
        System.log("Status", "Attempting safe terminate");
        let eventManager = require("./GlobalEvents");
        if (backlog.length > 0)
            flushBacklog();
        let timeout = setTimeout(() => {
            process.exit(1);
        }, 5000).unref();
        eventManager.listen("UNLOAD", () => {
            clearTimeout(timeout);
        }, { singleUse: true });
        eventManager.trigger("TERMINATE");
    }
    System.attemptSafeTerminate = attemptSafeTerminate;
    function attachTerminateListeners(db, server) {
        process.on("uncaughtException", err => {
            System.fatal(err, System.ERRORS.APP_BOOT, "uncaughtException");
        });
        process.on("SIGTERM", signal("SIGTERM"));
        process.on("SIGINT", signal("SIGINT"));
        eventManager.listen("TERMINATE", () => {
            db.end().then(() => {
                server.close(() => {
                    eventManager.trigger("UNLOAD");
                });
            }).catch(x => {
                console.error(x);
                process.exit(1);
            });
        }, { singleUse: true });
    }
    System.attachTerminateListeners = attachTerminateListeners;
})(System = exports.System || (exports.System = {}));
//# sourceMappingURL=System.js.map