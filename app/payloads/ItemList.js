"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasePayload_1 = require("./BasePayload");
class Items extends BasePayload_1.BasePayload {
    constructor(id, quantity) {
        super();
        this.id = id;
        this.quantity = quantity;
    }
}
exports.Items = Items;
//# sourceMappingURL=ItemList.js.map