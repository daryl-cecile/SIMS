///<reference path="../../app/shape/Inventory.d.ts"/>

class XInventoryTable extends HTMLElement{
    private _items:XInventoryItem[] = [];
    private shadow:ShadowRoot = null;

    constructor(){
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    public get items(){
        return this._items;
    }

    public addItem(item:XInventoryItem){
        item.own(this);
        item.addEventListener('update', this._saveHandler.bind(this));
        this._items.push(item);
        this.reset();
    }

    public removeItem(item:XInventoryItem){
        item.disown();
        item.removeEventListener('update', this._saveHandler.bind(this));
    }

    public reset(){
        let eb = Tools.ElementBuilder;
        this.shadow.innerHTML = "";
        this.shadow.appendChild( eb("link",{
            href : "/public/styles/xinventory.css",
            rel : "stylesheet"
        }).create() );
        this.shadow.appendChild( eb("ul",{ id:"list" }).create());

        for (let item of this._items){
            let itemElement = item.getElement();
            if (itemElement == null) continue;
            this.shadow.querySelector("#list").appendChild(itemElement);
        }
    }

    private _saveHandler(ev){
        this.dispatchEvent(
            new CustomEvent('save', {
                bubbles: true,
                detail: ev.detail
            })
        );
    }

 }

 class XInventoryItem extends HTMLElement{
     public model = null;
     private isChecked:boolean = false;
     private shadow:ShadowRoot = null;
     private owner:XInventoryTable = null;

     public values:IInventory = null;

     constructor(){
         super();
         this.shadow = this.attachShadow({ mode: "open" });
     }

     public get checked(){
         return this.isChecked;
     }

     private updatePreviews(){
         if (this.values === null) return;

         (this.shadow.querySelector('input[type=checkbox]') as any).checked = this.isChecked;
         this.shadow.querySelector(".preview-img").setAttribute('src', this.model.item.previewImg);
         this.shadow.querySelector("#sku").innerHTML = this.model.id;
         this.shadow.querySelector("#name").innerHTML = this.model.item.name;
         this.shadow.querySelector("#desc").innerHTML = this.model.item.description;
         this.shadow.querySelector("#store-loc").innerHTML = `${this.model.storageLocation.name} (${this.model.storageLocation.location})`;
         this.shadow.querySelector("#unit-count").innerHTML = this.model.item.unitCount.toString();
     }

     private updateVisuals(){
         if (this.model == null) return;
         if (this.values === null) this.values = Object.assign({}, this.model);
         let eb = Tools.ElementBuilder;
         this.shadow.innerHTML = "";
         this.shadow.appendChild( eb("link",{
             href : "/public/styles/xinventory.css",
             rel : "stylesheet"
         }).create() );

         this.shadow.appendChild( eb("div",{
             class: "preview-bar"
         }).create(el => {
             el.appendChild( eb("input",{type:"checkbox"}).create(cb => {
                 cb.addEventListener('change',()=>{
                     this.isChecked = cb.checked;
                 });
             }) );
             el.appendChild( eb("img", {class:"preview-img", src:this.model.item.previewImg}).create() );
             el.appendChild( eb("span",{id:"sku"}, this.model.item.id).create() );
             el.appendChild( eb("span",{id:"name"}, this.model.item.name).create() );
             el.appendChild( eb("span",{id:"desc"}, this.model.item.description).create() );
             el.appendChild( eb("span",{id:"store-loc"}, `${this.model.storageLocation.name} (${this.model.storageLocation.location})`).create() );
             el.appendChild( eb("span",{id:"unit-count"}, this.model.item.unitCount.toString()).create() );
             el.appendChild( eb("button",{id:"edit-btn"}, "Edit").create(btn => {
                 btn.addEventListener('click', ()=>{
                     let infoBox = this.shadow.querySelector(".info-box");
                     if (infoBox.classList.contains("open")){
                         this.updatePreviews();
                         this.dispatchEvent(
                             new CustomEvent('update', {
                                 bubbles: true,
                                 detail: this.values
                             })
                         );
                         infoBox.classList.remove("open");
                         btn.innerHTML = "Edit";
                     }
                     else{
                         infoBox.classList.add("open");
                         btn.innerHTML = "Save";
                     }
                 });
             }) );
         }) );

         this.shadow.appendChild( eb("div",{
             class: "info-box"
         }).create(el => {
             let that = this;
             el.appendChild( eb("img",{src: this.model.item.previewImg}).create() );
             el.appendChild( eb("div").create(d => {
                 that.values.id = this.model.id;
                 that.values.item.id = this.model.item.id;

                 d.appendChild( eb("label").create(lbl => {
                     lbl.appendChild( eb("span", "Name").create() );
                     lbl.appendChild( eb("input",{type:"text", name:"name", value: this.model.item.name}).create(i => {
                         i.addEventListener('input', function(){ that.values.item.name = this.value });
                     }) )
                 }) );

                 d.appendChild( eb("label").create(lbl => {
                     lbl.appendChild( eb("span", "Unit Count").create() );
                     lbl.appendChild( eb("input",{type:"number", name:"unit_count", min: 0, value: this.model.item.unitCount}).create(i => {
                         i.addEventListener('input', function(){ that.values.item.unitCount = parseInt(this.value) });
                     }) )
                 }) );

                 d.appendChild( eb("label").create(lbl => {
                     lbl.appendChild( eb("span", "Quantity (per unit)").create() );
                     lbl.appendChild( eb("input",{type:"number", name:"quantity", min: 0, value: this.model.quantity}).create(i => {
                         i.addEventListener('input', function(){ that.values.quantity = parseInt(this.value) });
                     }) )
                 }) );

                 d.appendChild( eb("label").create(lbl => {
                     lbl.appendChild( eb("span", "Expiry").create() );
                     lbl.appendChild( eb("input",{type:"date", name:"expiry", value: Tools.DateToDOMCompatString(this.model.item.expiry) }).create(i => {
                         i.addEventListener('input', function(){ that.values.item.expiry = new Date(this.value + "T00:00:00.000Z") });
                     }) )
                 }) );

                 d.appendChild( eb("label").create(lbl => {
                     lbl.appendChild( eb("span", "Description").create() );
                     lbl.appendChild( eb("textarea",{name:"description"},this.model.item.description).create(i => {
                         i.addEventListener('input', function(){ that.values.item.description = this.value });
                     }) )
                 }) );

                 d.appendChild( eb("label").create(lbl => {
                     lbl.appendChild( eb("span", "Notices (one per line)").create() );
                     lbl.appendChild( eb("textarea",{name:"notices"}, this.model.item.notices.map(n => n.title).join("\n")).create(i => {
                         i.addEventListener('input', function(){ that.values.item.notices = this.value.split("\n").map(n => {
                             return {title:n}
                         }) });
                     }) )
                 }) );
             }) );
         }) );
     }

     public getElement(){
         if (this.model == null) return null;
         return (()=>{
             this.updateVisuals();
             return this;
         })();
     }

     public disown(){
         this.owner = null;
         return this;
     }

     public own(owner){
         this.owner = owner;
         return this;
     }
 }

 customElements.define('inventory-item', XInventoryItem);
 customElements.define('inventory-table', XInventoryTable);