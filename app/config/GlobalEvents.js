class GlobalEventManager {
    constructor() {
        this.eventRegister = [];
        this.triggeredEventNames = [];
    }
    listen(eventNameOrNames, handler, properties = {}) {
        let listOfEventNames;
        if (typeof eventNameOrNames === "string" || eventNameOrNames instanceof String) {
            listOfEventNames = [eventNameOrNames];
        }
        else {
            listOfEventNames = eventNameOrNames;
        }
        listOfEventNames.forEach(eventName => {
            let p = GlobalEvent.fixProperties(properties);
            let e = new GlobalEvent(eventName, handler, p);
            this.eventRegister.push(e);
            if (p.autoTriggerIfMissed === true && this.triggeredEventNames.indexOf(eventName) > -1)
                e.trigger();
        });
        return this;
    }
    trigger(eventName, ...params) {
        this.eventRegister = this.eventRegister.filter(e => {
            if (e.eventName.toLowerCase() === eventName.toLowerCase()) {
                e.trigger(...params);
                return true;
            }
            else if (e.isInvalid === true) {
                return false;
            }
            return true;
        });
        this.triggeredEventNames.push(eventName);
        return this;
    }
}
class GlobalEvent {
    constructor(eventName, handler, prop = {}) {
        this.handler = () => { };
        this.props = {};
        this.triggeredCount = 0;
        this.isInvalid = false;
        this.eventName = eventName;
        this.handler = handler;
        this.props = GlobalEvent.fixProperties(prop);
    }
    trigger(...params) {
        this.handler.apply(this, params);
        this.triggeredCount++;
        if (this.props.singleUse === true && this.triggeredCount > 0) {
            this.isInvalid = true;
        }
    }
    static fixProperties(prop) {
        return (Object.assign({
            singleUse: false,
            autoTriggerIfMissed: false
        }, prop));
    }
}
module.exports = new GlobalEventManager();
//# sourceMappingURL=GlobalEvents.js.map