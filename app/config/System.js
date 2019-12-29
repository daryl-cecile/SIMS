"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SystemLogEntryModel_1 = require("../models/SystemLogEntryModel");
const SystemLogRepository_1 = require("../Repository/SystemLogRepository");
const XError_1 = require("./XError");
var System;
(function (System) {
    const backlog = [];
    let interval = null;
    let isProd = null;
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
        ERRORS[ERRORS["DB_BOOT"] = 2] = "DB_BOOT";
        ERRORS[ERRORS["APP_BOOT"] = 1] = "APP_BOOT";
        ERRORS[ERRORS["NORMAL"] = 0] = "NORMAL";
    })(ERRORS = System.ERRORS || (System.ERRORS = {}));
    async function err(err, errcode, extraInfo) {
        let e = XError_1.XError.createFrom(err);
        let rSF = e.stackFrames[0];
        let message = e.message;
        if (extraInfo)
            message += "\n\n\t" + extraInfo;
        return await System.log(e.type, `${rSF.fileName}:${rSF.lineNumber}:${rSF.columnNumber}\n\t${message}`, errcode);
    }
    System.err = err;
    async function log(title, message, errCode) {
        if (!errCode)
            errCode = System.ERRORS.NORMAL;
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
})(System = exports.System || (exports.System = {}));
//# sourceMappingURL=System.js.map