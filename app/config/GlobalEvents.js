class GlobalEventManager {
    constructor() {
        this.eventRegister = [];
        this.triggeredEventNames = [];
    }
    listen(eventName, handler, properties = {}) {
        let p = GlobalEvent.fixProperties(properties);
        let e = new GlobalEvent(eventName, handler, p);
        this.eventRegister.push(e);
        if (p.autoTriggerIfMissed === true && this.triggeredEventNames.indexOf(eventName) > -1)
            e.trigger();
        return this;
    }
    trigger(eventName, ...params) {
        this.eventRegister.forEach(e => {
            if (e.eventName.toLowerCase() === eventName.toLowerCase()) {
                e.trigger(...params);
            }
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
        if (this.props.singleUse === true && this.triggeredCount > 0)
            return;
        this.handler.apply(this, params);
        this.triggeredCount++;
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