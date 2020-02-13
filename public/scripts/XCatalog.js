class CatalogItem {
    constructor(options) {
        var _a, _b;
        this._name = "";
        this._description = "";
        this._itemRef = "";
        this._image = "";
        this._ignoreUpdates = false;
        this._onRemove = () => { };
        this._onUpdate = () => { };
        this.name = options.name;
        this.description = (_a = options.description, (_a !== null && _a !== void 0 ? _a : ""));
        this.itemReference = options.itemReference;
        this.imageUrl = (_b = options.imageUrl, (_b !== null && _b !== void 0 ? _b : "/public/res/sims-logo.png"));
    }
    get name() { return this._name; }
    get description() { return this._description; }
    get itemReference() { return this._itemRef; }
    get imageUrl() { return this._image; }
    set name(v) { this._name = v; this.update(); }
    set description(v) { this._description = v; this.update(); }
    set itemReference(v) { this._itemRef = v; this.update(); }
    set imageUrl(v) { this._image = v; this.update(); }
    onRemove(h) {
        this._onRemove = h;
        return this;
    }
    onUpdate(h) {
        this._onUpdate = h;
        return this;
    }
    ignoreUpdates() {
        this._ignoreUpdates = true;
        return this;
    }
    resumeUpdates() {
        this._ignoreUpdates = false;
        return this;
    }
    update() {
        if (this._ignoreUpdates === true)
            return this;
        this._onUpdate();
        return this;
    }
}
class CatalogCollection {
    constructor() {
        this._onUpdate = () => { };
        this._collection = [];
    }
    get itemCount() {
        if (this._collection) {
            return this._collection.length;
        }
        return 0;
    }
    addItem(item) {
        this._collection.push(item);
        return this;
    }
    getItemByReference(reference) {
        for (const item of this._collection) {
            if (item.itemReference === reference)
                return item;
        }
        return null;
    }
    eachItem(handler) {
        for (let i = 0; i < this._collection.length; i++) {
            let prev = i > 0 ? this._collection[i - 1] : null;
            let next = i < this._collection.length - 1 ? this._collection[i + 1] : null;
            handler(this._collection[i], prev, next);
        }
        return this;
    }
}
class XCatalog extends HTMLElement {
    constructor() {
        super();
        this._collection = null;
        this._shadow = this.attachShadow({ mode: "closed" });
    }
    get collection() {
        return this._collection;
    }
    connectedCallback() {
        this.refresh();
        this.updateVisuals();
    }
    disconnectedCallback() {
        if (this._shadow !== null)
            this._shadow.innerHTML = "";
    }
    attachCollection(collection) {
        this.detachCollection();
        this._collection = collection;
        this.refresh();
        this.updateVisuals();
        return this;
    }
    detachCollection() {
        if (this._collection === null)
            return this;
        this._collection = null;
        return this;
    }
    updateVisuals() {
        if (this.collection) {
            this.refresh();
            this.collection.eachItem((item, prev, next) => {
                let el = this.createItemElement(item);
                this._shadow.appendChild(el);
                el.updateValue();
            });
        }
    }
    setup() {
        let l = document.createElement("link");
        l.href = "/public/styles/xcatalog.css";
        l.rel = "stylesheet";
        this._shadow.appendChild(l);
    }
    refresh() {
        if (this._shadow !== null)
            this._shadow.innerHTML = "";
        this.setup();
        return this;
    }
    get itemCount() {
        if (this._collection) {
            return this._collection.itemCount;
        }
        return 0;
    }
    createItemElement(item) {
        let it = document.createElement("xcatalog-item");
        it.setAttribute('id', "item-" + item.itemReference);
        it.imgSrc = item.imageUrl;
        it.name = item.name;
        it.description = item.description;
        return it;
    }
}
customElements.define('x-catalog', XCatalog);
class XCatalogItem extends HTMLElement {
    constructor() {
        super();
        this._imgSrc = "";
        this._name = "";
        this._description = "";
        this._initialized = false;
        if (!this._shadow)
            this._shadow = this.attachShadow({ mode: "closed" });
    }
    get imgSrc() { return this._imgSrc; }
    set imgSrc(v) { this._imgSrc = v; this.updateValue(); }
    get name() { return this._name; }
    set name(v) { this._name = v; this.updateValue(); }
    get description() { return this._description; }
    set description(v) { this._description = v; this.updateValue(); }
    static generateBody(opt) {
        let options = Object.assign(opt, {
            imgSrc: "/public/res/sims-logo.png",
            imgDesc: "",
            itemInfo: "",
            quantity: 1
        });
        return `
        <img id="item-image" src="${options.imgSrc}" alt="${options.imgDesc}">
        <div id="info">
            <p id="title">${options.title}</p>
            <p id="description">${options.itemInfo}</p>
        </div>
        `;
    }
    updateValue() {
        var _a;
        if (this._initialized) {
            (_a = this._shadow.querySelector('#item-image')) === null || _a === void 0 ? void 0 : _a.setAttribute('src', this.imgSrc);
            this._shadow.querySelector('#title').innerHTML = this.name;
            this._shadow.querySelector('#description').innerHTML = this.description;
        }
    }
    connectedCallback() {
        this.reset({
            title: this.name,
            imgDesc: this.description,
            itemInfo: this.description,
            imgSrc: this.imgSrc
        });
        this._initialized = true;
    }
    disconnectedCallback() {
        this.clearResource();
        this._initialized = false;
    }
    setup() {
        let l = document.createElement("link");
        l.href = "/public/styles/xcatalogItem.css";
        l.rel = "stylesheet";
        this._shadow.appendChild(l);
    }
    reset(opt) {
        if (this._shadow !== null) {
            this._shadow.innerHTML = XCatalogItem.generateBody(opt);
            this.setup();
        }
    }
    clearResource() {
        if (this._shadow !== null)
            this._shadow.innerHTML = "";
    }
    emitEvent(eventName, data = {}) {
        this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: data
        }));
        return this;
    }
}
customElements.define('xcatalog-item', XCatalogItem);
//# sourceMappingURL=XCatalog.js.map