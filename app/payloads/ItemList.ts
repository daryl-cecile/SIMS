import {BasePayload} from "./BasePayload";

export class Items extends BasePayload {

    constructor(public id:number, public quantity:number) {
        super();
    }
}