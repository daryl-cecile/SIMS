class XLogView extends HTMLElement {
    constructor() {
        super();
        this.entries = [];
        this.label = "LogView";
        this._shadow = this.attachShadow({ mode: "closed" });
    }
    static get observedAttributes() { return ['label']; }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "label") {
            this.label = newValue;
        }
        this.updateVisuals();
    }
    connectedCallback() {
        this.refresh();
        this.updateVisuals();
    }
    disconnectedCallback() {
        if (this._shadow !== null)
            this._shadow.innerHTML = "";
    }
    updateVisuals() {
        this.refresh();
        this.entries.forEach((item) => {
            let el = this.createItemElement(item);
            this._shadow.appendChild(el);
        });
    }
    setup() {
        let l = document.createElement("link");
        l.href = "/public/styles/xlogview.css";
        l.rel = "stylesheet";
        this._shadow.appendChild(l);
    }
    refresh() {
        if (this._shadow !== null)
            this._shadow.innerHTML = "";
        let titleBar = document.createElement('div');
        titleBar.innerHTML = this.label;
        this._shadow.appendChild(titleBar);
        this.setup();
        return this;
    }
    createItemElement(item) {
        let it = document.createElement("li");
        it.innerHTML = `<span style="color:${item.color.cssHex}">${item.name} </span> <span> ${item.content}</span>`;
        return it;
    }
    addEntry(entry) {
        this.entries.push(entry);
        this.updateVisuals();
        return this;
    }
    dropAllEntries() {
        this.entries = [];
        return this;
    }
}
customElements.define('log-view', XLogView);
//# sourceMappingURL=XLogView.js.map