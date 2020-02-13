"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RouterSet {
    constructor(handler) {
        this.handler = handler;
    }
    getRouter(baseRouter = require('express').Router()) {
        return this.handler(baseRouter);
    }
}
exports.RouterSet = RouterSet;
//# sourceMappingURL=RouterSet.js.map