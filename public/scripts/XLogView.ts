
type XLogViewEntry = {
    name: string;
    content: string;
    color: Tools.Color;
}

class XLogView extends HTMLElement{

    private readonly _shadow:ShadowRoot;
    public entries:XLogViewEntry[] = [];
    public label:string = "LogView";

    static get observedAttributes() { return ['label']; }

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "closed" });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "label"){
            this.label = newValue;
        }
        this.updateVisuals();
    }

    connectedCallback() { // added to page
        this.refresh();
        this.updateVisuals();
    }

    disconnectedCallback(){
        if (this._shadow !== null) this._shadow.innerHTML = "";
    }

    private updateVisuals(){
        this.refresh();
        this.entries.forEach((item) => {
            let el = this.createItemElement(item);
            this._shadow.appendChild( el );
        });
    }

    private setup(){
        let l = document.createElement("link");
        l.href = "/public/styles/xlogview.css";
        l.rel = "stylesheet";
        this._shadow.appendChild( l );
    }

    private refresh(){
        if (this._shadow !== null) this._shadow.innerHTML = "";
        let titleBar = document.createElement('div');
        titleBar.innerHTML = this.label;
        this._shadow.appendChild(titleBar);
        this.setup();
        return this;
    }

    private createItemElement(item:XLogViewEntry){
        let it = document.createElement("li");
        it.innerHTML = `<span style="color:${item.color.cssHex}">${item.name} </span> <span> ${item.content}</span>`;
        return it;
    }

    public addEntry(entry:XLogViewEntry){
        this.entries.push(entry);
        this.updateVisuals();
        return this;
    }

    public dropAllEntries(){
        this.entries = [];
        return this;
    }

}

customElements.define('log-view', XLogView);

