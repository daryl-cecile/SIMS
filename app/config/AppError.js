"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convenienceHelpers_1 = require("./convenienceHelpers");
class AppError extends Error {
    constructor() {
        super(...arguments);
        this.isAppError = true;
    }
    get type() { return this._type; }
    get message() { return this._message; }
    get originalStack() { return this._originalStack; }
    static createFrom(error, originalError) {
        let xe = new AppError();
        xe.name = "AppError";
        xe._type = error.name;
        xe._message = error.message;
        xe._originalStack = error.stack;
        if (!convenienceHelpers_1.isNullOrUndefined(originalError))
            xe.originalError = originalError;
        else
            xe.originalError = error;
        xe.createStack(this.createFrom);
        return xe;
    }
    static fromMessage(message, originalError) {
        let e = new Error(message);
        return this.createFrom(e, originalError);
    }
    createStack(implementation) {
        if (convenienceHelpers_1.isNullOrUndefined(implementation))
            implementation = (this.createStack || AppError);
        Error.captureStackTrace(this, implementation);
    }
}
exports.AppError = AppError;
//# sourceMappingURL=AppError.js.map