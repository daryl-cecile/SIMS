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
        this._shadow = this.attachShadow({ mode: "open" });
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
        let currentItemElementIds = [...this._shadow.querySelectorAll("ul.b-list > li")].map(el => el.id.replace("item-", ""));
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
                    existing.querySelector("img").src = item.imageUrl;
                    existing.querySelector("p:nth-of-type(1)").innerHTML = item.name;
                    existing.querySelector("p:nth-of-type(2)")
                        .querySelector("span:nth-of-type(1)").innerHTML = `Quantity: ${item.quantity}`;
                }
            });
            currentItemElementIds.forEach(itemId => {
                let itemEl = this._shadow.querySelector("#item-" + itemId);
                itemEl.classList.add("hiding");
                setTimeout(() => {
                    itemEl.remove();
                }, 240);
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
        let it = document.createElement("li");
        it.id = "item-" + item.itemReference;
        let img = document.createElement("img");
        img.src = item.imageUrl;
        it.appendChild(img);
        let div = document.createElement("div");
        it.appendChild(div);
        let nameEl = document.createElement("p");
        nameEl.innerHTML = item.name;
        div.appendChild(nameEl);
        let infoEl = document.createElement("p");
        infoEl.innerHTML = `<span>Quantity: ${item.quantity}</span>`;
        let cntl = document.createElement("span");
        let a_max = document.createElement("a");
        a_max.href = "#";
        a_max.onclick = () => {
            let currentItem = this.collection.getItemByReference(item.itemReference);
            if (currentItem) {
                const MAX_STOCK_COUNT = 50;
                if (currentItem.quantity < MAX_STOCK_COUNT) {
                    currentItem.quantity++;
                }
            }
        };
        a_max.innerHTML = '<i class="far fa-plus-square"></i>';
        cntl.appendChild(a_max);
        let a_min = document.createElement("a");
        a_min.href = "#";
        a_min.onclick = () => {
            let currentItem = this.collection.getItemByReference(item.itemReference);
            if (currentItem) {
                currentItem.quantity--;
                if (currentItem.quantity === 0) {
                    this.collection.removeItemByReference(item.itemReference);
                }
            }
        };
        a_min.innerHTML = '<i class="far fa-minus-square"></i>';
        cntl.appendChild(a_min);
        let a_del = document.createElement("a");
        a_del.href = "#";
        a_del.onclick = () => { this.collection.removeItemByReference(item.itemReference); };
        a_del.innerHTML = '<i class="far fa-trash-alt"></i>';
        cntl.appendChild(a_del);
        infoEl.appendChild(cntl);
        div.appendChild(infoEl);
        return it;
    }
}
customElements.define('x-basket', XBasket);
class XProduct extends HTMLElement {
    constructor() {
        super();
        this._collection = null;
        this._shadow = this.attachShadow({ mode: "open" });
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
        this._shadow.querySelector("#title").innerHTML = `<strong> Product </strong> <span>(${this.itemCount} Items)</span>`;
        this._shadow.querySelector(".checkout-btn").innerHTML = `<button>Checkout ${this.itemCount} item(s)</span>`;
        let currentItemElementIds = [...this._shadow.querySelectorAll("ul.b-list > li")].map(el => el.id.replace("item-", ""));
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
                    existing.querySelector("img").src = item.imageUrl;
                    existing.querySelector("p:nth-of-type(1)").innerHTML = item.name;
                    existing.querySelector("p:nth-of-type(2)")
                        .querySelector("span:nth-of-type(1)").innerHTML = `Quantity: ${item.quantity}`;
                }
            });
            currentItemElementIds.forEach(itemId => {
                let itemEl = this._shadow.querySelector("#item-" + itemId);
                itemEl.classList.add("hiding");
                setTimeout(() => {
                    itemEl.remove();
                }, 240);
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
        let container = document.createElement("ul");
        container.className = "b-list";
        this._shadow.appendChild(container);
        if (this.itemCount > 0) {
            this.collection.eachItem(item => {
                let it = this.createItemElement(item);
                container.appendChild(it);
            });
        }
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
        let it = document.createElement("li");
        it.id = "item-" + item.itemReference;
        let img = document.createElement("img");
        img.src = item.imageUrl;
        it.appendChild(img);
        let div = document.createElement("div");
        it.appendChild(div);
        let nameEl = document.createElement("p");
        nameEl.innerHTML = item.name;
        div.appendChild(nameEl);
        return it;
    }
}
customElements.define('x-product', XProduct);
//# sourceMappingURL=XBasket.js.map