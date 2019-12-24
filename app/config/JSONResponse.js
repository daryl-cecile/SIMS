"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JSONResp {
    constructor(success, title, messageOrData, data) {
        this._data = {};
        this._success = success;
        if (title)
            this._title = title;
        if (messageOrData && (typeof messageOrData === "string" || messageOrData instanceof String)) {
            this._message = messageOrData;
            if (data)
                this._data = data;
        }
        else if (messageOrData) {
            this._message = "";
            this._data = messageOrData;
        }
    }
    get object() {
        return {
            isSuccessful: this._success,
            title: this._title,
            message: this._message,
            payload: this._data
        };
    }
    toString() {
        return JSON.stringify(this.object);
    }
}
exports.JSONResp = JSONResp;
function JSONResponse(success, title, messageOrData, data) {
    return (new JSONResp(success, title, messageOrData, data)).toString();
}
exports.JSONResponse = JSONResponse;
//# sourceMappingURL=JSONResponse.js.map