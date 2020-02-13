///<reference path="../../app/shape/Inventory.d.ts"/>

class XInventoryTable extends HTMLElement{
    private _items:XInventoryItem[] = [];
    private shadow:ShadowRoot = null;
    public selectedItems:XInventoryItem[] = [];

    constructor(){
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    public get items(){
        return this._items;
    }

    public async createNew(){
        let locs = (await Tools.getStorageLocations());
        let inventoryEntry:IItem = {
            createdAt: <any>(new Date()).toISOString(),
            description: "",
            expiry: <any>(new Date()).toISOString(),
            id: undefined,
            name: "",
            notices: "",
            previewImg: "/public/res/sims-logo.png",
            quantity: 0,
            storageLocation: locs?.[0],
            unitCount: 0,
            updatedAt: <any>(new Date()).toISOString()

        };
        console.log("new template",locs,inventoryEntry);
        let entry = <XInventoryItem>document.createElement("inventory-item");
        entry.reloadOnSave = true;
        entry.model = inventoryEntry;
        this.addItem(entry);

        entry.shadowRoot.querySelector("#edit-btn").innerHTML = "Save";
        entry.shadowRoot.querySelector(".info-box").classList.add("open");
    }

    public addItem(item:XInventoryItem){
        item.own(this);
        item.addEventListener('update', this._saveHandler.bind(this));
        item.addEventListener('gotfile', this._newFileHandler.bind(this));
        item.addEventListener('itemselected',this._itemSelectedHandler.bind(this));
        this._items.push(item);
        this.reset();
    }

    public removeItem(item:XInventoryItem){
        item.disown();
        item.removeEventListener('update', this._saveHandler.bind(this));
        item.removeEventListener('gotfile', this._newFileHandler.bind(this));
        item.removeEventListener('itemselected',this._itemSelectedHandler.bind(this));
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

    private _itemSelectedHandler(ev){
        let collection = this.items.filter(i => i.checked);
        this.dispatchEvent(
            new CustomEvent('selectionchanged', {
                bubbles: true,
                detail: collection
            })
        );
        if (collection.length > 0){
            this.selectedItems = collection;
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

    private _newFileHandler(ev){
        this.dispatchEvent(
            new CustomEvent('newfile', {
                bubbles: true,
                detail: ev.detail
            })
        );
    }

 }

 class XInventoryItem extends HTMLElement{
     public model:IItem = null;
     private isChecked:boolean = false;
     private shadow:ShadowRoot = null;
     private owner:XInventoryTable = null;
     private hasChanges:boolean = false;
     public reloadOnSave:boolean = false;

     public values:IItem = null;

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
         this.shadow.querySelector(".preview-img").setAttribute('src', this.values.previewImg);
         this.shadow.querySelector("#sku").innerHTML = this.values.id?.toString();
         this.shadow.querySelector("#name").innerHTML = this.values.name;
         this.shadow.querySelector("#desc").innerHTML = this.values.description;
         this.shadow.querySelector("#store-loc").innerHTML = `${this.values.storageLocation.name} (${this.values.storageLocation.location})`;
         this.shadow.querySelector("#unit-count").innerHTML = this.values.unitCount?.toString();
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
             let that = this;
             el.appendChild( eb("input",{type:"checkbox"}).create(cb => {
                 cb.addEventListener('change',()=>{
                     this.isChecked = cb.checked;
                     this.dispatchEvent(
                         new CustomEvent('itemselected', {
                             bubbles: true,
                             detail: this.values
                         })
                     );
                 });
             }) );
             el.appendChild( eb("img", {class:"preview-img", src:this.model.previewImg}).create() );
             el.appendChild( eb("span",{id:"sku"}, this.model.id?.toString()).create() );
             el.appendChild( eb("span",{id:"name"}, this.model.name).create() );
             el.appendChild( eb("span",{id:"desc"}, this.model.description).create() );
             el.appendChild( eb("span",{id:"store-loc"}, `${this.model.storageLocation.name} (${this.model.storageLocation.location})`).create() );
             el.appendChild( eb("span",{id:"unit-count"}, this.model.unitCount?.toString()).create() );
             el.appendChild( eb("button",{id:"edit-btn"}, "Edit").create(btn => {
                 btn.addEventListener('click', ()=>{
                     let infoBox = this.shadow.querySelector(".info-box");
                     if (infoBox.classList.contains("open")){
                         if (this.hasChanges){
                             this.dispatchEvent(
                                 new CustomEvent('update', {
                                     bubbles: true,
                                     detail: {
                                         values: this.values,
                                         callback:function(){
                                             that.hasChanges = false;
                                             if (that.reloadOnSave){
                                                 location.reload();
                                             }
                                             else that.updatePreviews();
                                         }
                                     }
                                 })
                             );
                         }

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
             let fileInput = null;
             el.appendChild( eb("input",{type:"file", name:"prev"}).create(i => {
                 fileInput = i;
                 i.addEventListener('change', function(){
                     that.dispatchEvent(
                         new CustomEvent('gotfile', {
                             bubbles: true,
                             detail: {
                                 file : i.files[0],
                                 callback: function(src){
                                     that.hasChanges = true;
                                     that.values.previewImg = src;
                                     (that.shadow.querySelector("#img-prev") as HTMLImageElement).src = src;
                                     that.updatePreviews();
                                     return that;
                                 }
                             }
                         })
                     );
                 });
             }) );
             el.appendChild( eb("img",{id:"img-prev", src: this.model.previewImg}).create(img => {
                 img.addEventListener('click', function(){
                     (fileInput as HTMLElement).click();
                 });
             }) );
             el.appendChild( eb("div").create(d => {
                 that.values.id = this.model.id;

                 d.appendChild( eb("label").create(lbl => {
                     lbl.appendChild( eb("span", "Name").create() );
                     lbl.appendChild( eb("input",{type:"text", name:"name", value: this.model.name}).create(i => {
                         i.addEventListener('input', function(){ that.values.name = this.value; that.hasChanges =true });
                     }) )
                 }) );

                 d.appendChild( eb("label").create(lbl => {
                     lbl.appendChild( eb("span", "Unit Count").create() );
                     lbl.appendChild( eb("input",{type:"number", name:"unit_count", min: 0, value: this.model.unitCount}).create(i => {
                         i.addEventListener('input', function(){ that.values.unitCount = parseInt(this.value); that.hasChanges =true });
                     }) )
                 }) );

                 d.appendChild( eb("label").create(lbl => {
                     lbl.appendChild( eb("span", "Quantity (per unit)").create() );
                     lbl.appendChild( eb("input",{type:"number", name:"quantity", min: 0, value: this.model.quantity}).create(i => {
                         i.addEventListener('input', function(){ that.values.quantity = parseInt(this.value); that.hasChanges =true });
                     }) )
                 }) );

                 d.appendChild( eb("label").create(lbl => {
                     lbl.appendChild( eb("span", "Expiry").create() );
                     lbl.appendChild( eb("input",{type:"date", name:"expiry", value: Tools.DateToDOMCompatString(this.model.expiry) }).create(i => {
                         i.addEventListener('input', function(){ that.values.expiry = new Date(this.value + "T00:00:00.000Z"); that.hasChanges =true });
                     }) )
                 }) );

                 d.appendChild( eb("label").create(lbl => {
                     lbl.appendChild( eb("span", "Description").create() );
                     lbl.appendChild( eb("textarea",{name:"description"},this.model.description).create(i => {
                         i.addEventListener('input', function(){ that.values.description = this.value; that.hasChanges =true });
                     }) )
                 }) );

                 d.appendChild( eb("label").create(lbl => {
                     lbl.appendChild( eb("span", "Notices (one per line)").create() );
                     lbl.appendChild( eb("textarea",{name:"notices"}, this.model.notices).create(i => {
                         i.addEventListener('input', function(){ that.values.notices = this.value; that.hasChanges =true });
                     }) )
                 }) );

                 d.appendChild( eb("label").create(lbl => {
                     lbl.appendChild( eb("span", "Storage Location").create() );
                     lbl.appendChild( eb("select",{value: this.model.storageLocation.id}).create(async i => {

                         let locs = await Tools.getStorageLocations();

                         i.addEventListener('input', function(){
                             let curr = locs.filter(l => l.id === parseInt(this.value))[0];
                             that.values.storageLocation.id = parseInt(this.value);
                             that.values.storageLocation.name = curr.name;
                             that.values.storageLocation.location = curr.location;
                             that.hasChanges =true
                         });

                         locs.forEach(x => {
                             if (x.id == this.model.storageLocation.id){
                                 i.appendChild( eb("option",{selected:true, value:x.id},`${x.name} (${x.location})`).create() );
                             }
                             else{
                                 i.appendChild( eb("option",{value:x.id},`${x.name} (${x.location})`).create() );
                             }
                         });

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

 Tools.getStorageLocations();

 customElements.define('inventory-item', XInventoryItem);
 customElements.define('inventory-table', XInventoryTable);