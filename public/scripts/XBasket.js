class BasketItem {
    constructor(options) {
        var _a, _b, _c;
        this._name = "";
        this._description = "";
        this._quantity = 1;
        this._itemRef = "";
        this._image = "";
        this._ignoreUpdates = false;
        this._onRemove = () => { };
        this._onUpdate = () => { };
        this.name = options.name;
        this.description = (_a = options.description, (_a !== null && _a !== void 0 ? _a : ""));
        this.itemReference = options.itemReference;
        this.quantity = (_b = options.quantity, (_b !== null && _b !== void 0 ? _b : 1));
        this.imageUrl = (_c = options.imageUrl, (_c !== null && _c !== void 0 ? _c : "/public/res/sims-logo.png"));
    }
    get name() { return this._name; }
    get description() { return this._description; }
    get quantity() { return this._quantity; }
    get itemReference() { return this._itemRef; }
    get imageUrl() { return this._image; }
    set name(v) { this._name = v; this.update(); }
    set description(v) { this._description = v; this.update(); }
    set quantity(v) { this._quantity = v; this.update(); }
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
class BasketCollection {
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
        item.onUpdate(() => {
            this.refresh();
        });
        this._collection.push(item);
        this.refresh();
        return this;
    }
    getItemByReference(reference) {
        for (const item of this._collection) {
            if (item.itemReference === reference)
                return item;
        }
        return null;
    }
    removeItemByReference(reference) {
        let item = this.getItemByReference(reference);
        let itemIndex = this._collection.indexOf(item);
        if (itemIndex === -1)
            return null;
        let removedItem = this._collection.splice(itemIndex, 1);
        this.refresh();
        return removedItem;
    }
    onUpdate(h) {
        this._onUpdate = h;
        return this;
    }
    refresh() {
        this._onUpdate();
    }
    eachItem(handler) {
        for (let i = 0; i < this._collection.length; i++) {
            let item = this._collection[i];
            let prev = i > 0 ? this._collection[i - 1] : null;
            let next = i < this._collection.length - 1 ? this._collection[i + 1] : null;
            handler(item, prev, next);
        }
        return this;
    }
}
class XBasket extends HTMLElement {
    constructor() {
        super();
        this._collection = null;
        this._shadow = this.attachShadow({ mode: "closed" });
    }
    get collection() {
        return this._collection;
    }
    connectedCallback() {
        this.setup();
    }
    disconnectedCallback() {
        this.reset();
    }
    attachCollection(collection) {
        this.detachCollection();
        this._collection = collection;
        this._collection.onUpdate(() => this.updateVisuals());
        this.refresh();
        return this;
    }
    detachCollection() {
        if (this._collection === null)
            return this;
        this._collection.onUpdate(() => { });
        this._collection = null;
        return this;
    }
    updateVisuals() {
        this._shadow.querySelector("#title").innerHTML = `<strong> Basket </strong> <span>(${this.itemCount} Items)</span>`;
        this._shadow.querySelector(".checkout-btn").innerHTML = `<button>Checkout ${this.itemCount} item(s)</span>`;
        let currentItemElementIds = [...this._shadow.querySelectorAll("ul.b-list > xbasket-item")].map(el => el.id.replace("item-", ""));
        if (this.itemCount > 0) {
            this.collection.eachItem((item, prev, next) => {
                let existing = this._shadow.querySelector("#item-" + item.itemReference);
                currentItemElementIds.splice(currentItemElementIds.indexOf(item.itemReference), 1);
                if (!existing) {
                    let container = this._shadow.querySelector("ul.b-list");
                    let it = this.createItemElement(item);
                    if (next) {
                        let nextEl = this._shadow.querySelector("#item-" + next.itemReference);
                        if (nextEl)
                            nextEl.insertAdjacentElement("beforebegin", it);
                        else
                            container.appendChild(it);
                    }
                    else if (prev) {
                        let prevEl = this._shadow.querySelector("#item-" + prev.itemReference);
                        if (prevEl)
                            prevEl.insertAdjacentElement("afterend", it);
                        else
                            container.appendChild(it);
                    }
                    else {
                        container.appendChild(it);
                    }
                }
                else {
                    existing.setAttribute('src', item.imageUrl);
                    existing.setAttribute('title', item.name);
                }
            });
        }
    }
    setup() {
        let l = document.createElement("link");
        l.href = "/public/styles/xbasket.css";
        l.rel = "stylesheet";
        this._shadow.appendChild(l);
        let s = document.createElement("link");
        s.href = "https://kit-free.fontawesome.com/releases/latest/css/free.min.css";
        s.rel = "stylesheet";
        this._shadow.appendChild(s);
        let title = document.createElement("div");
        title.innerHTML = `<strong> Basket </strong> <span>(${this.itemCount} Items)</span>`;
        title.id = "title";
        title.className = "title";
        this._shadow.appendChild(title);
        let container = document.createElement("ul");
        container.className = "b-list";
        this._shadow.appendChild(container);
        if (this.itemCount > 0) {
            this.collection.eachItem(item => {
                let it = this.createItemElement(item);
                container.appendChild(it);
            });
        }
        let checkoutSection = document.createElement("div");
        checkoutSection.className = "checkout-btn";
        checkoutSection.innerHTML = `<button>Checkout ${this.itemCount} item(s)</button>`;
        this._shadow.appendChild(checkoutSection);
    }
    reset() {
        if (this._shadow !== null)
            this._shadow.innerHTML = "";
    }
    refresh() {
        this.reset();
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
        let it = document.createElement("xbasket-item");
        it.setAttribute('id', "item-" + item.itemReference);
        it.setAttribute('src', item.imageUrl);
        it.setAttribute('title', item.name);
        it.setAttribute('desc', item.description);
        it.setAttribute('quantity', String(item.quantity));
        it.addEventListener('removed', () => {
            this.collection.removeItemByReference(item.itemReference);
        });
        return it;
    }
}
customElements.define('x-basket', XBasket);
class XBasketItem extends HTMLElement {
    constructor() {
        super();
        this._imgSrc = "";
        this._quantity = 0;
        this._deleted = false;
        this._title = "";
        this._desc = "";
        this._maxStockCount = 1000;
        this._initialized = false;
        this._shadow = this.attachShadow({ mode: "closed" });
    }
    get quantity() { return this._quantity; }
    set quantity(v) {
        this._quantity = v;
        if (this._quantity > this._maxStockCount)
            this._quantity = this._maxStockCount;
        if (this._quantity <= 0)
            this._quantity = 0;
        this.updateVisuals();
    }
    get title() { return this._title; }
    set title(v) { this._title = v; this.updateVisuals(); }
    get description() { return this._desc; }
    set description(v) { this._desc = v; this.updateVisuals(); }
    get max() { return this._maxStockCount; }
    set max(v) { this._maxStockCount = v; this.updateVisuals(); }
    static get observedAttributes() { return ['src', 'title', 'desc', 'quantity', 'max']; }
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
        <div id="edit">
            <div>
                <button id="decrease-btn">&minus;</button>
                <span id="quantity">${options.quantity}</span>
                <button id="increase-btn">&plus;</button>
            </div>
        </div>
        `;
    }
    connectedCallback() {
        this.reset({
            title: this._title,
            imgDesc: this._desc,
            itemInfo: this._desc,
            imgSrc: this._imgSrc,
            quantity: 1
        });
        this._initialized = true;
        this.updateVisuals();
    }
    disconnectedCallback() {
        this.clearResource();
        this._initialized = false;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "src":
                this._imgSrc = newValue;
                break;
            case "quantity":
                this._quantity = parseInt(newValue);
                break;
            case "title":
                this._title = newValue;
                break;
            case "desc":
                this._desc = newValue;
                break;
            case "max":
                this._maxStockCount = newValue;
                break;
        }
        this.updateVisuals();
    }
    updateVisuals() {
        if (this._initialized) {
            if (this._quantity <= 0 && this._deleted === false)
                this._deleted = true;
            if (this._shadow !== null) {
                this._shadow.querySelector('#item-image').setAttribute('src', this._imgSrc);
                this._shadow.querySelector('#quantity').innerHTML = String(this._quantity);
                this._shadow.querySelector('#description').innerHTML = String(this._desc);
            }
            if (this._deleted === true) {
                this.classList.add("hiding");
                setTimeout(() => {
                    this.remove();
                    this.emitEvent('removed');
                }, 240);
            }
        }
    }
    setup() {
        let l = document.createElement("link");
        l.href = "/public/styles/xbasketItem.css";
        l.rel = "stylesheet";
        this._shadow.appendChild(l);
        this._shadow.querySelector('#increase-btn').addEventListener('click', () => {
            this.quantity += 1;
        });
        this._shadow.querySelector('#decrease-btn').addEventListener('click', () => {
            this.quantity -= 1;
        });
    }
    reset(opt) {
        if (this._shadow !== null) {
            this._shadow.innerHTML = XBasketItem.generateBody(opt);
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
    dispose() {
        this._deleted = true;
        this.updateVisuals();
    }
}
customElements.define('xbasket-item', XBasketItem);
//# sourceMappingURL=XBasket.js.map