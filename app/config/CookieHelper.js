"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cookies = require("cookies");
class CookieStore {
    constructor(req, res) {
        this._originalCookieLibInstance = new Cookies(req, res, { keys: ["_SIMS_PASSPORT_KEY_"] });
    }
    get(cookieName) {
        return this._originalCookieLibInstance.get(cookieName, { signed: true });
    }
    set(name, value, options) {
        let defaultOptions = Object.assign({
            httpOnly: false,
            secure: false,
            path: "/",
            overwrite: false
        }, options);
        defaultOptions['signed'] = true;
        defaultOptions['sameSite'] = 'strict';
        this._originalCookieLibInstance.set(name, value, defaultOptions);
        return this;
    }
    del(name) {
        this._originalCookieLibInstance.set(name);
        return this;
    }
}
exports.CookieStore = CookieStore;
//# sourceMappingURL=CookieHelper.js.map