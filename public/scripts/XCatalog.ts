
interface ICatalogItemOption{
    name?:string;
    description?:string;
    quantity?:number;
    itemReference?:number;
    imageUrl?:string;
    entry?:IItem;
}

type XCatalogItemProperties = {
    title:string,
    imgSrc?:string,
    imgDesc?:string,
    itemInfo?:string,
    quantity?:number,
    reference?:number;
}

class CatalogItem{

    private _name:string = "";
    private _description:string = "";
    private _itemRef:number = 0;
    private _image:string = "";

    public itemModel:IItem;

    private _ignoreUpdates:boolean = false;
    private _onRemove:Function = ()=>{};
    private _onUpdate:Function = ()=>{};

    public get name(){ return this._name; }
    public get description(){ return this._description }
    public get itemReference(){ return this._itemRef }
    public get imageUrl(){ return this._image }
    public set name(v){ this._name = v; this.update(); }
    public set description(v){ this._description = v; this.update(); }
    public set itemReference(v){ this._itemRef = v; this.update(); }
    public set imageUrl(v){ this._image = v; this.update(); }

    public onRemove(h:Function){
        this._onRemove = h;
        return this;
    }

    public onUpdate(h:Function){
        this._onUpdate = h;
        return this;
    }

    private ignoreUpdates(){
        this._ignoreUpdates = true;
        return this;
    }

    private resumeUpdates(){
        this._ignoreUpdates = false;
        return this;
    }

    private update(){
        if (this._ignoreUpdates === true) return this;
        this._onUpdate();
        return this;
    }

    constructor(options:ICatalogItemOption) {
        if (options.entry){
            this.name = options.entry.name;
            this.description = options.entry.description ?? "";
            this.itemReference = options.entry.id;
            this.imageUrl = options.entry.previewImg ?? "/public/res/sims-logo.png";
            this.itemModel = options.entry;
        }
        else{
            this.name = options.name;
            this.description = options.description ?? "";
            this.itemReference = options.itemReference;
            this.imageUrl = options.imageUrl ?? "/public/res/sims-logo.png";
        }
    }

}

class CatalogCollection{

    private _onUpdate:Function = ()=>{};

    private _collection:CatalogItem[] = [];

    public get itemCount(){
        if (this._collection){
            return this._collection.length;
        }
        return 0;
    }

    public addItem(item:CatalogItem){
        this._collection.push(item);
        return this;
    }

    public getItemByReference(reference:number){
        for (const item of this._collection){
            if (item.itemReference === reference) return item;
        }
        return null;
    }

    public eachItem(handler:(item:CatalogItem, previousItem:CatalogItem, nextItem:CatalogItem)=>void){
        for (let i = 0; i < this._collection.length; i++){
            let prev = i > 0 ? this._collection[i-1] : null;
            let next = i < this._collection.length - 1 ? this._collection[i+1] : null;
            handler(this._collection[i], prev, next);
        }
        return this;
    }

}

class XCatalog extends HTMLElement{

    private readonly _shadow:ShadowRoot;
    private _collection:CatalogCollection = null;

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "closed" });
    }

    public get collection(){
        return this._collection;
    }

    connectedCallback() { // added to page
        this.refresh();
        this.updateVisuals();
    }

    disconnectedCallback(){
        if (this._shadow !== null) this._shadow.innerHTML = "";
    }

    public attachCollection(collection:CatalogCollection){
        this.detachCollection();
        this._collection = collection;
        this.refresh();

        this.updateVisuals();
        return this;
    }

    public detachCollection(){
        if (this._collection === null) return this;
        this._collection = null;
        return this;
    }

    private updateVisuals(){
        if (this.collection){
            this.refresh();
            this.collection.eachItem((item,prev, next) => {
                let el = this.createItemElement(item);
                this._shadow.appendChild( el );
                el.updateValue();
            });
        }
    }

    private setup(){
        let l = document.createElement("link");
        l.href = "/public/styles/xcatalog.css";
        l.rel = "stylesheet";
        this._shadow.appendChild( l );
    }

    private refresh(){
        if (this._shadow !== null) this._shadow.innerHTML = "";
        this.setup();
        return this;
    }

    private get itemCount(){
        if (this._collection){
            return this._collection.itemCount;
        }
        return 0;
    }

    private createItemElement(item:CatalogItem){

        let it:XCatalogItem = <any>document.createElement("xcatalog-item");
        it.setAttribute('id', "item-" + item.itemReference);
        it.imgSrc = item.imageUrl;
        it.name = item.name;
        it.description = item.description;

        it.addEventListener('click',() => {
            this.dispatchEvent(
                new CustomEvent('itempicked', {
                    bubbles: true,
                    detail: item.itemModel
                })
            );
        });

        return it;

    }

}

customElements.define('x-catalog', XCatalog);


class XCatalogItem extends HTMLElement{

    public _imgSrc:string = "";
    public _name:string = "";
    public _description:string = "";
    private _initialized:boolean = false;

    public get imgSrc(){ return this._imgSrc }
    public set imgSrc(v){ this._imgSrc = v; this.updateValue() }

    public get name(){ return this._name }
    public set name(v){ this._name = v; this.updateValue() }

    public get description(){ return this._description }
    public set description(v){ this._description = v; this.updateValue() }

    private readonly _shadow:ShadowRoot;

    constructor(){
        super();
        if (!this._shadow) this._shadow = this.attachShadow({ mode: "closed" });
    }

    static generateBody(opt:XCatalogItemProperties){
        let options = Object.assign(opt, {
            imgSrc:"/public/res/sims-logo.png",
            imgDesc:"",
            itemInfo:"",
            quantity: 1
        });

        return `
        <img id="item-image" src="${options.imgSrc}" alt="${options.imgDesc}">
        <div id="info">
            <p id="title">${options.title}</p>
            <p id="description">${options.itemInfo}</p>
        </div>
        `
    }

    public updateValue(){
        if (this._initialized){
            this._shadow.querySelector('#item-image')?.setAttribute('src', this.imgSrc);
            this._shadow.querySelector('#title').innerHTML = this.name;
            this._shadow.querySelector('#description').innerHTML = this.description;
        }
    }

    connectedCallback() { // added to page
        this.reset({
            title: this.name,
            imgDesc: this.description,
            itemInfo: this.description,
            imgSrc: this.imgSrc,
        });
        this._initialized = true;
    }

    disconnectedCallback(){
        this.clearResource();
        this._initialized = false;
    }

    private setup(){

        let l = document.createElement("link");
        l.href = "/public/styles/xcatalogItem.css";
        l.rel = "stylesheet";
        this._shadow.appendChild( l );

    }

    private reset(opt:XCatalogItemProperties){
        if (this._shadow !== null) {
            this._shadow.innerHTML = XCatalogItem.generateBody(opt);
            this.setup();
        }
    }

    private clearResource(){
        if (this._shadow !== null) this._shadow.innerHTML = "";
    }

    private emitEvent(eventName:string,data={}){
        this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: data
        }));
        return this;
    }

}

customElements.define('xcatalog-item', XCatalogItem);
