
interface GlobalEventProperties {
    singleUse?:boolean;
    autoTriggerIfMissed?:boolean;
}

class GlobalEventManager{
    private eventRegister:Array<GlobalEvent> = [];
    private triggeredEventNames:Array<string> = [];

    public listen(eventName:string, handler:Function, properties:GlobalEventProperties={}){
        let p = GlobalEvent.fixProperties(properties);
        let e = new GlobalEvent(eventName,handler,p);
        this.eventRegister.push(e);
        if (p.autoTriggerIfMissed === true && this.triggeredEventNames.indexOf(eventName) > -1) e.trigger();
        return this;
    }

    public trigger(eventName:string,...params:any[]){
        this.eventRegister.forEach(e => {
            if (e.eventName.toLowerCase() === eventName.toLowerCase()){
                e.trigger(...params);
            }
        });
        this.triggeredEventNames.push(eventName);
        return this;
    }
}

class GlobalEvent{
    private handler:Function = ()=>{};
    private props:GlobalEventProperties = {};
    private triggeredCount:number = 0;

    public isInvalid:boolean = false;
    public eventName:string;

    constructor(eventName:string, handler:Function, prop:GlobalEventProperties={}) {
        this.eventName = eventName;
        this.handler = handler;
        this.props = GlobalEvent.fixProperties(prop);
    }

    public trigger(...params:any[]){
        if (this.props.singleUse === true && this.triggeredCount > 0) return;
        this.handler.apply(this,params);
        this.triggeredCount ++;
    }

    public static fixProperties(prop:GlobalEventProperties):GlobalEventProperties{
        return <GlobalEventProperties>(Object.assign({
            singleUse:false,
            autoTriggerIfMissed:false
        },prop));
    }
}

module.exports = new GlobalEventManager();