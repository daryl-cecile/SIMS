import {BasePayload} from "./BasePayload";
import {Items} from "./ItemList";

export class RefundItemList extends BasePayload {
    constructor(public transactionCode:number, public items:Items[]) {
        super();
    }
}