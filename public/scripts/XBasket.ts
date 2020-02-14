
class BasketItem{

    private _name:string = "";
    private _description:string = "";
    private _quantity:number = 1;
    private _itemRef:number = 0;
    private _image:string = "";

    private _ignoreUpdates:boolean = false;
    private _onRemove:Function = ()=>{};
    private _onUpdate:Function = ()=>{};

    public get name(){ return this._name; }
    public get description(){ return this._description }
    public get quantity(){ return this._quantity }
    public get itemReference(){ return this._itemRef }
    public get imageUrl(){ return this._image }
    public set name(v){ this._name = v; this.update(); }
    public set description(v){ this._description = v; this.update(); }
    public set quantity(v){ this._quantity = v; this.update(); }
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
        this.name = options.name;
        this.description = options.description ?? "";
        this.itemReference = options.itemReference;
        this.quantity = options.quantity ?? 1;
        this.imageUrl = options.imageUrl ?? "/public/res/sims-logo.png";
    }

}

class BasketCollection{

    private _onUpdate:Function = ()=>{};

    private _collection:BasketItem[] = [];

    public get itemCount(){
        if (this._collection){
            return this._collection.length;
        }
        return 0;
    }

    public addItem(item:BasketItem){
        item.onUpdate(()=>{
            this.refresh();
        });
        this._collection.push(item);
        this.refresh();
        return this;
    }

    public getItemByReference(reference:number):BasketItem{
        for (const item of this._collection){
            if (item.itemReference === reference) return item;
        }
        return null;
    }

    public removeItemByReference(reference:number){
        let item = this.getItemByReference(reference);
        let itemIndex = this._collection.indexOf(item);
        if (itemIndex === -1) return null;
        let removedItem = this._collection.splice( itemIndex, 1 );
        this.refresh();
        return removedItem;
    }

    public onUpdate(h:Function){
        this._onUpdate = h;
        return this;
    }

    public refresh(){
        this._onUpdate();
    }

    public eachItem(handler:(item:BasketItem, previousItem:BasketItem, nextItem:BasketItem)=>void){
        for (let i = 0; i < this._collection.length; i++){
            let item = this._collection[i];
            let prev = i > 0 ? this._collection[i-1] : null;
            let next = i < this._collection.length - 1 ? this._collection[i+1] : null;

            handler(item, prev, next);
        }
        return this;
    }

}

class XBasket extends HTMLElement{

    private readonly _shadow:ShadowRoot;
    private _collection:BasketCollection = null;
    public basketChildren:XBasketItem[] = [];

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "closed" });
    }

    public get collection(){
        return this._collection;
    }

    connectedCallback() { // added to page
        this.setup();
    }

    disconnectedCallback(){
        this.reset();
    }

    public updateChild(id:number, handler:(item:XBasketItem)=>void){
        let child = this.basketChildren.filter(c => parseInt(c.getAttribute('data-ref')) === id)?.[0];
        if (child) {
            handler(child);
            child.updateVisuals();
            return true;
        }
        return false;
    }

    public updateAll(){
        this.basketChildren.forEach(c => {
            c.updateVisuals();
        });
        return this;
    }

    public attachCollection(collection:BasketCollection){
        this.detachCollection();
        this._collection = collection;
        this._collection.onUpdate(()=>this.updateVisuals() );
        this.refresh();
        return this;
    }

    public detachCollection(){
        if (this._collection === null) return this;
        this._collection.onUpdate(()=>{});
        this._collection = null;
        this.basketChildren = [];
        return this;
    }

    public updateVisuals(){
        this._shadow.querySelector("#title").innerHTML = `<strong> Basket </strong> <span>(${this.itemCount} Items)</span>`;
        this._shadow.querySelector(".checkout-btn").innerHTML = `<button>Checkout ${this.itemCount} item(s)</span>`;

        let currentItemElementIds = [... this._shadow.querySelectorAll("ul.b-list > xbasket-item")].map(el => parseInt(el.id.replace("item-","")));

        if (this.itemCount > 0){
            this.collection.eachItem((item,prev, next) => {
                let existing = this._shadow.querySelector("#item-" + item.itemReference);
                currentItemElementIds.splice( currentItemElementIds.indexOf(item.itemReference) , 1 );

                if (!existing){

                    let container = this._shadow.querySelector("ul.b-list");
                    let it = this.createItemElement(item);
                    this.basketChildren.push(it);

                    if (next){
                        let nextEl = this._shadow.querySelector("#item-"+next.itemReference);
                        if (nextEl) nextEl.insertAdjacentElement("beforebegin", it);
                        else container.appendChild(it);
                    }
                    else if (prev){
                        let prevEl = this._shadow.querySelector("#item-"+prev.itemReference);
                        if (prevEl) prevEl.insertAdjacentElement("afterend", it);
                        else container.appendChild(it);
                    }
                    else{
                        container.appendChild(it);
                    }

                }
                else{
                    existing.setAttribute('src', item.imageUrl);
                    existing.setAttribute('title',item.name);
                }
            });

        }
    }

    private setup(){

        let l = document.createElement("link");
        l.href = "/public/styles/xbasket.css";
        l.rel = "stylesheet";
        this._shadow.appendChild( l );

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

        if (this.itemCount > 0){
            this.collection.eachItem(item => {
                let it = this.createItemElement(item);
                container.appendChild(it);
            });
        }

        let checkoutSection = document.createElement("div");
        checkoutSection.className = "checkout-btn";
        checkoutSection.innerHTML = `<button>Checkout ${this.itemCount} item(s)</button>`;
        this._shadow.appendChild(checkoutSection);


        checkoutSection.addEventListener('click',(ev)=>{
            if (ev.target === checkoutSection.querySelector('button') && this.itemCount > 0){
                this.dispatchEvent(
                    new CustomEvent("checkout", {
                        bubbles: true,
                        detail: {
                            items : this.basketChildren.map(child => {
                                return {
                                    id : child.getAttribute('data-ref'),
                                    quantity : child.quantity
                                }
                            })
                        }
                    })
                );
            }
        });
    }

    private reset(){
        if (this._shadow !== null) this._shadow.innerHTML = "";
    }

    private refresh(){
        this.reset();
        this.setup();
        return this;
    }

    private get itemCount(){
        if (this._collection){
            return this._collection.itemCount;
        }
        return 0;
    }

    private createItemElement(item:BasketItem){

        let it:XBasketItem = <any>document.createElement("xbasket-item");
        it.setAttribute('id', "item-" + item.itemReference);
        it.setAttribute('data-ref',item.itemReference.toString());
        it.setAttribute('src', item.imageUrl);
        it.setAttribute('title', item.name);
        it.setAttribute('desc', item.description);
        it.setAttribute('quantity', String(item.quantity));

        it.addEventListener('removed',(ev)=>{
            this.collection.removeItemByReference(item.itemReference);
            let itm = (<any>ev).detail;
            this.basketChildren.splice( this.basketChildren.indexOf( itm ) , 1 )
        });

        return it;

    }

}

customElements.define('x-basket', XBasket);


class XBasketItem extends HTMLElement{

    private _imgSrc:string = "";
    private _quantity:number = 0;
    private _deleted:boolean = false;
    private _title:string = "";
    private _desc:string = "";
    private _maxStockCount:number = 1000;
    private _initialized:boolean = false;

    public get quantity(){ return this._quantity; }
    public set quantity(v){
        this._quantity = v;
        if (this._quantity > this._maxStockCount) this._quantity = this._maxStockCount;
        if (this._quantity <= 0) this._quantity = 0;
        this.updateVisuals()
    }

    public get title(){ return this._title; }
    public set title(v){ this._title = v; this.updateVisuals() }

    public get description(){ return this._desc; }
    public set description(v){ this._desc = v; this.updateVisuals() }

    public get max(){ return this._maxStockCount; }
    public set max(v){ this._maxStockCount = v; this.updateVisuals() }

    static get observedAttributes() { return ['src','title','desc','quantity','max']; }

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
        <div id="edit">
            <div>
                <button id="decrease-btn">&minus;</button>
                <span id="quantity">${options.quantity}</span>
                <button id="increase-btn">&plus;</button>
            </div>
        </div>
        `
    }

    private readonly _shadow:ShadowRoot;

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "closed" });
    }

    connectedCallback() { // added to page
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

    disconnectedCallback(){
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

    public updateVisuals(){
        if (this._initialized){
            if (this._quantity <= 0 && this._deleted === false) this._deleted = true;

            if (this._shadow !== null){
                this._shadow.querySelector('#item-image').setAttribute('src', this._imgSrc);
                this._shadow.querySelector('#quantity').innerHTML = String(this._quantity);
                this._shadow.querySelector('#description').innerHTML = String(this._desc);
            }

            if (this._deleted === true){
                this.classList.add("hiding");
                setTimeout(()=>{
                    this.remove();
                    this.emitEvent('removed', this);
                },240);
            }

        }
    }

    private setup(){

        let l = document.createElement("link");
        l.href = "/public/styles/xbasketItem.css";
        l.rel = "stylesheet";
        this._shadow.appendChild( l );

        this._shadow.querySelector('#increase-btn').addEventListener('click',()=>{
            this.quantity += 1;
        });

        this._shadow.querySelector('#decrease-btn').addEventListener('click',()=>{
            this.quantity -= 1;
        });

    }

    private reset(opt:XCatalogItemProperties){
        if (this._shadow !== null) {
            this._shadow.innerHTML = XBasketItem.generateBody(opt);
            this.setup();
        }
    }

    private clearResource(){
        if (this._shadow !== null) this._shadow.innerHTML = "";
    }

    private emitEvent(eventName:string,data={}){
        this.dispatchEvent(
            new CustomEvent(eventName, {
                bubbles: true,
                detail: data
            })
        );
        return this;
    }

    public dispose(){
        this._deleted = true;
        this.updateVisuals();
    }

}

customElements.define('xbasket-item', XBasketItem);
