
interface IBasketItemOption{
    name:string;
    description?:string;
    quantity?:number;
    itemReference:string;
    imageUrl?:string;
}

class BasketItem{

    private _name:string = "";
    private _description:string = "";
    private _quantity:number = 1;
    private _itemRef:string = "";
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

    constructor(options:IBasketItemOption) {
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

    public getItemByReference(reference:string){
        for (const item of this._collection){
            if (item.itemReference === reference) return item;
        }
        return null;
    }

    public removeItemByReference(reference:string){
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

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "open" });
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
        return this;
    }

    private updateVisuals(){
        this._shadow.querySelector("#title").innerHTML = `<strong> Basket </strong> <span>(${this.itemCount} Items)</span>`;
        this._shadow.querySelector(".checkout-btn").innerHTML = `<button>Checkout ${this.itemCount} item(s)</span>`;

        let currentItemElementIds = [... this._shadow.querySelectorAll("ul.b-list > li")].map(el => el.id.replace("item-",""));

        if (this.itemCount > 0){
            this.collection.eachItem((item,prev, next) => {
                let existing = this._shadow.querySelector("#item-" + item.itemReference);
                currentItemElementIds.splice( currentItemElementIds.indexOf(item.itemReference) , 1 );

                if (!existing){

                    let container = this._shadow.querySelector("ul.b-list");
                    let it = this.createItemElement(item);

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
                    existing.querySelector("img").src = item.imageUrl;
                    existing.querySelector("p:nth-of-type(1)").innerHTML = item.name;

                    existing.querySelector("p:nth-of-type(2)")
                        .querySelector("span:nth-of-type(1)").innerHTML = `Quantity: ${item.quantity}`;
                }
            });

            currentItemElementIds.forEach(itemId => {
                let itemEl = this._shadow.querySelector("#item-"+itemId);
                itemEl.classList.add("hiding");
                setTimeout(()=>{
                    itemEl.remove();
                },240);
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
        a_max.onclick = ()=>{
            let currentItem = this.collection.getItemByReference(item.itemReference);
            if (currentItem) {
                const MAX_STOCK_COUNT = 50;
                if (currentItem.quantity < MAX_STOCK_COUNT){
                    // TODO check MAX_STOCK_COUNT from endpoint
                    currentItem.quantity ++;
                }
            }
        };
        a_max.innerHTML = '<i class="far fa-plus-square"></i>';
        cntl.appendChild(a_max);

        let a_min = document.createElement("a");
        a_min.href = "#";
        a_min.onclick = ()=>{
            let currentItem = this.collection.getItemByReference(item.itemReference);
            if (currentItem) {
                currentItem.quantity --;
                if (currentItem.quantity === 0){
                    this.collection.removeItemByReference(item.itemReference)
                }
            }
        };
        a_min.innerHTML = '<i class="far fa-minus-square"></i>';
        cntl.appendChild(a_min);

        let a_del = document.createElement("a");
        a_del.href = "#";
        a_del.onclick = ()=>{ this.collection.removeItemByReference(item.itemReference) };
        a_del.innerHTML = '<i class="far fa-trash-alt"></i>';
        cntl.appendChild(a_del);

        infoEl.appendChild(cntl);
        div.appendChild(infoEl);

        return it;

    }

}

customElements.define('x-basket', XBasket);