"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SystemLogEntryModel_1 = require("../models/SystemLogEntryModel");
const SystemLogRepository_1 = require("../Repository/SystemLogRepository");
const AppError_1 = require("./AppError");
const CookieHelper_1 = require("./CookieHelper");
const DBConnection_1 = require("./DBConnection");
const convenienceHelpers_1 = require("./convenienceHelpers");
const FSManager_1 = require("./FSManager");
const Passport_1 = require("../Services/Passport");
const eventManager = require('./GlobalEvents');
var System;
(function (System) {
    const backlog = [];
    let interval = null;
    let isProd = null;
    let ignoreOutput = false;
    System.storagePath = "";
    System.InstanceId = require("crypto").randomBytes(12).toString('hex');
    function isProduction() {
        if (isProd === null)
            isProd = (process.env.IS_PROD == "true");
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
        var _a;
        let e = (!convenienceHelpers_1.isNullOrUndefined(err['isAppError']) ? err : AppError_1.AppError.createFrom(err));
        let message = e.message;
        let xs = (err || err.stack).toString() + "\n\n\n";
        if (extraInfo) {
            message += "\n\n\t" + extraInfo;
            xs += extraInfo;
        }
        await System.log(e.type, `${_a = e.originalStack, (_a !== null && _a !== void 0 ? _a : e.stack)}\n\t${message}`, errcode, xs);
    }
    System.error = error;
    async function log(title, message, errCode, extras = "") {
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
            entry.extraInformation = extras;
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
            }, 500).unref();
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
        eventManager.listen("UNLOADED", () => {
            setTimeout(process.exit, 1000).unref();
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
        eventManager.listen("QUIT", () => {
            console.warn("Quitting...");
            setTimeout(process.exit, 5000, 1).unref();
        }, { singleUse: true });
        eventManager.listen("TERMINATE", async () => {
            let allLogs = await SystemLogRepository_1.SystemLogRepository.getAll();
            allLogs.forEach(element => {
                if (Date.now() >= element.expiry.getTime()) {
                    SystemLogRepository_1.SystemLogRepository.delete(element);
                }
            });
            DBConnection_1.dbConnector.end().then(() => {
                server.close(() => {
                    if (DBConnection_1.dbConnector.isReleased)
                        eventManager.trigger("UNLOADED");
                    else
                        eventManager.trigger("QUIT");
                });
            });
        }, { singleUse: true });
    }
    System.attachTerminateListeners = attachTerminateListeners;
    function loader(app) {
        let loaders = {
            registerBaseControllers: (...routers) => {
                let hostRouter = require('express').Router();
                routers.forEach(r => {
                    hostRouter = r.getRouter(hostRouter);
                    app.use("/", hostRouter);
                });
                return loaders;
            },
            registerEndpointControllers: (...routers) => {
                let hostRouter = require('express').Router();
                routers.forEach(r => {
                    hostRouter = r.getRouter(hostRouter);
                    app.use("/api", hostRouter);
                });
                return loaders;
            }
        };
        return loaders;
    }
    System.loader = loader;
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
        function SecurityMiddleware() {
            const CSRFCookieName = "_csrf";
            return async function (req, res, next) {
                var _a, _b, _c;
                if (req.url.startsWith("/api/")) {
                    let cookieCSRF = System.cookieStore.get(CSRFCookieName);
                    if (cookieCSRF === undefined) {
                        res.status(403);
                        res.send('CSRF token invalid');
                        return;
                    }
                    else {
                        if (System.isProduction() && (req.url.startsWith("/api/login") === false && req.url.startsWith("/api/list") === false) && (await Passport_1.Passport.isAuthenticated()).object.isSuccessful === false) {
                            res.status(403);
                            res.send('API Token missing or invalid');
                            return;
                        }
                        let providedCSRFToken = (_c = (_b = (_a = req.header('CSRF-Token'), (_a !== null && _a !== void 0 ? _a : req.header('X-CSRF-TOKEN'))), (_b !== null && _b !== void 0 ? _b : req.query['CSRF_Token'])), (_c !== null && _c !== void 0 ? _c : req.body['CSRF_Token']));
                        if (providedCSRFToken === undefined || providedCSRFToken !== cookieCSRF) {
                            res.status(403);
                            res.send('CSRF token mismatch');
                            return;
                        }
                    }
                    next();
                }
                else {
                    let csrfToken = require("crypto").randomBytes(32).toString('hex');
                    System.cookieStore.set(CSRFCookieName, csrfToken, { overwrite: true });
                    req.csrfToken = function () { return csrfToken; };
                    next();
                }
            };
        }
        Middlewares.SecurityMiddleware = SecurityMiddleware;
        function FileUploadHandler() {
            let multer = require("multer");
            return function (req, res, next) {
                let accept = multer({
                    preservePath: true,
                    limits: {
                        fileSize: 10000000
                    },
                    storage: multer.diskStorage({
                        destination: System.storagePath,
                        filename: function (req, file, cb) {
                            cb(null, `${Date.now()}-${file.originalname}`);
                        }
                    })
                }).any();
                accept(req, res, function () {
                    FSManager_1.FSManager.setIncomingFiles(req.files);
                    req.files = FSManager_1.FSManager.getIncomingFiles();
                    next();
                });
            };
        }
        Middlewares.FileUploadHandler = FileUploadHandler;
    })(Middlewares = System.Middlewares || (System.Middlewares = {}));
})(System = exports.System || (exports.System = {}));
module.exports.default = System;
//# sourceMappingURL=System.js.map