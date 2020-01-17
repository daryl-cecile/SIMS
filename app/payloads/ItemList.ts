import {BasePayload} from "./BasePayload";

export class Items extends BasePayload {

    constructor(public itemCode:string, public quantity:number) {
        super();
    }
}