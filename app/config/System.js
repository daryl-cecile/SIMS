"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SystemLogEntryModel_1 = require("../models/SystemLogEntryModel");
const SystemLogRepository_1 = require("../Repository/SystemLogRepository");
const XError_1 = require("./XError");
const CookieHelper_1 = require("./CookieHelper");
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
            if (err && err.stack)
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
    function attachTerminateListeners(server) {
        process.on("uncaughtException", err => {
            System.fatal(err, System.ERRORS.APP_BOOT, "uncaughtException");
        });
        process.on("SIGTERM", signal("SIGTERM"));
        process.on("SIGINT", signal("SIGINT"));
        eventManager.listen("TERMINATE", () => {
            server.close(() => {
                eventManager.trigger("UNLOAD");
            });
        }, { singleUse: true });
    }
    System.attachTerminateListeners = attachTerminateListeners;
    let Middlewares;
    (function (Middlewares) {
        function LogRequest() {
            return function (req, res, next) {
                System.log("Request", req.url, System.ERRORS.NORMAL);
                next();
            };
        }
        Middlewares.LogRequest = LogRequest;
        function CookieHandler() {
            return function (req, res, next) {
                System.cookieStore = new CookieHelper_1.CookieStore(req, res);
                next();
            };
        }
        Middlewares.CookieHandler = CookieHandler;
        function CSRFHandler() {
            const CSRFCookieName = "_csrf";
            return function (req, res, next) {
                var _a, _b, _c;
                if (req.url.startsWith("/api/")) {
                    let cookieCSRF = System.cookieStore.get(CSRFCookieName);
                    if (cookieCSRF === undefined) {
                        res.status(403);
                        res.send('CSRF token invalid');
                    }
                    else {
                        let providedCSRFToken = (_c = (_b = (_a = req.header('CSRF-Token'), (_a !== null && _a !== void 0 ? _a : req.header('X-CSRF-TOKEN'))), (_b !== null && _b !== void 0 ? _b : req.query['CSRF_Token'])), (_c !== null && _c !== void 0 ? _c : req.body['CSRF_Token']));
                        if (providedCSRFToken === undefined || providedCSRFToken !== cookieCSRF) {
                            res.status(403);
                            res.send('CSRF token mismatch');
                        }
                        else {
                            next();
                        }
                    }
                }
                else {
                    let csrfToken = require("crypto").randomBytes(32).toString('hex');
                    System.cookieStore.set(CSRFCookieName, csrfToken, { overwrite: true });
                    req.csrfToken = function () { return csrfToken; };
                    next();
                }
            };
        }
        Middlewares.CSRFHandler = CSRFHandler;
    })(Middlewares = System.Middlewares || (System.Middlewares = {}));
})(System = exports.System || (exports.System = {}));
//# sourceMappingURL=System.js.map