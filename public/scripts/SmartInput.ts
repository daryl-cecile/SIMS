
class SmartInputSuggestionItem{
    private readonly _url:string = "";
    private readonly _callback:Function = ()=>{};
    private readonly _value:any = null;
    private readonly _text:string = "";
    private readonly _useCallback:boolean = false;
    private readonly _id:string = "";

    constructor(text:string, value:any, callback:Function)
    constructor(text:string, value:any, url:string)
    constructor(text:string, value:any, callbackOrUrl:string|Function) {
        this._text = text;
        this._value = value;
        if ( typeof callbackOrUrl === "string" || callbackOrUrl instanceof String){
            this._url = <string>callbackOrUrl;
            this._useCallback = false;
        }
        else{
            this._callback = callbackOrUrl;
            this._useCallback = true;
        }
        this._id = SmartInputSuggestionItem.generateId();
    }

    public handle(){
        if (this._useCallback == true){
            this._callback.call(this, this._value)
        }
        else{
            location.href = this._url;
        }
    }

    public get htmlText():string{
        return `${this._text} <span>(${this._value})</span>`;
    }

    private static generateId(len:number=8){
        let arr = new Uint8Array((len || 40) / 2);
        window.crypto.getRandomValues(arr);
        return Array.from(arr, dec => ('0' + dec.toString(16)).substr(-2)).join('');
    }
}

class SmartInput extends HTMLElement{

    static get observedAttributes() { return ['value','placeholder','name','type']; }

    private _value = "";
    private _placeholder = "";
    private _name = "";
    private _shadow:ShadowRoot = null;
    private _timeout = null;
    private _type = "text";

    public suggestions:SmartInputSuggestionItem[] = [];

    public get value(){ return this._value; }
    public get placeholder(){ return this._placeholder; }
    public get name(){ return this._name; }
    public get type(){ return this._type; }
    public set value(v){ this._value = v; this.updateVisuals() }
    public set placeholder(v){ this._placeholder = v; this.updateVisuals() }
    public set name(v){ this._name = v; this.updateVisuals() }
    public set type(v){ this._type = v; this.updateVisuals(true) }

    connectedCallback() { // Added to page
        if (this._shadow === null) this._shadow = this.attachShadow({mode: 'open'});
        let styles = ["/public/styles/SmartInput.css"];

        styles.forEach(s => {
            let link = document.createElement("link");
            link.href = s;
            link.rel = "stylesheet";
            this._shadow.appendChild(link);
        });

        let inp = document.createElement("input");
        inp.type = "text";
        inp.id = "text-input";
        inp.value = this._value;
        inp.placeholder = this._placeholder;
        inp.addEventListener("input",(e)=>{
            if (inp.value !== this._value){
                this._value = inp.value;

                this.hideSuggestions();

                this.dispatchEvent(new CustomEvent("input", {
                    detail: {
                        value: inp.value
                    }
                }));

                if (this._timeout !== null){
                    clearTimeout(this._timeout);
                    this._timeout = null;
                }

                this._timeout = setTimeout(()=>{

                    this.dispatchEvent(new CustomEvent("value_changed", {
                        detail: {
                            value: inp.value
                        }
                    }));

                    this._timeout = null;
                }, 500);

                this.updateVisuals();
            }

            e.preventDefault();
            e.stopPropagation();
        });
        inp.addEventListener("blur",(e)=>{
            setTimeout(()=>{
                this.hideSuggestions();
            },100);
        });
        this._shadow.appendChild(inp);

        let dd = document.createElement("ul");
        dd.className = "dd";
        dd.id = "suggestions";
        this._shadow.appendChild(dd);

        this.updateVisuals();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        switch (name) {
            case "name":
                this.name = newValue;
                break;
            case "placeholder":
                this.placeholder = newValue;
                break;
            case "value":
                this.value = newValue;
                break;
            case "type":
                this.type = newValue;
                break;
        }
    }

    private updateVisuals(updateType:boolean=false){
        if (!this.isConnected) return this;
        let inp = <HTMLInputElement>this._shadow.getElementById("text-input");
        inp.placeholder = this._placeholder;
        inp.value = this._value;
        if (updateType === true && ["text","password"].indexOf(this._type) !== -1) {
            inp.type = this._type;
            inp.setAttribute("type", this._type);
        }
        return this;
    }

    clearSuggestions(){
        this.suggestions = [];
        this.hideSuggestions();
        return this;
    }

    hideSuggestions(){
        if (!this.isConnected) return this;
        let dd = this._shadow.getElementById("suggestions");
        dd.innerHTML = "";
        return this;
    }

    updateSuggestions(){
        if (!this.isConnected) return this;
        let dd = this._shadow.getElementById("suggestions");
        dd.innerHTML = "";

        this.suggestions.forEach((suggestion) => {
            let li = document.createElement("li");
            li.innerHTML = suggestion.htmlText;
            li.addEventListener("click", (e)=>{
                suggestion.handle.call(suggestion);
                this.hideSuggestions();
            });
            dd.appendChild(li);
        });
        return this;
    }

    disconnectedCallback() { // Removed from page
        if (this._shadow) this._shadow.innerHTML = "";
        this.clearSuggestions();
    }

}

customElements.define('smart-input', SmartInput);