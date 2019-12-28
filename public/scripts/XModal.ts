
enum XModalType{
    INFORMATION,
    WARNING,
    ALERT,
    QUESTION
}

enum XModalButtonType{
    PRIMARY,
    DANGER,
    CANCEL
}

interface XModalButtons {
    [buttonIdentifier:string]:{
        type: XModalButtonType,
        text: string,
        callback?: Function
    };
}

class XModal extends HTMLElement{

    private _shadow:ShadowRoot = null;
    private _title:string = "";
    private _message:string = "";
    private _type:XModalType = XModalType.INFORMATION;

    private _isAttached:boolean = false;

    static get observedAttributes() { return ['type','open']; }

    constructor(message:string, title:string=null, type:XModalType=XModalType.INFORMATION) {
        super();
        this._shadow = this.attachShadow({ mode: "closed" });
        this._type = type;
        this._message = message;
        this._title = title ? title : this._getTitle();
    }

    connectedCallback() {
        this._isAttached = true;
    }

    disconnectedCallback(){
        this._isAttached = false;
    }

    private _getTitle(){
        switch (this._type) {
            case XModalType.INFORMATION:
                return "Information";
            case XModalType.WARNING:
                return "Important!";
            case XModalType.ALERT:
                return "Attention!";
            case XModalType.QUESTION:
                return "Are you sure?";
        }
    }

    private _getButtonClass(buttonType:XModalButtonType){
        this._title = this._title + "";
        switch (buttonType) {
            case XModalButtonType.PRIMARY:
                return "button-primary";
            case XModalButtonType.DANGER:
                return "button-negative";
            case XModalButtonType.CANCEL:
                return "button-default";
        }
    }

    close(){
        return new Promise(resolve => {
            setTimeout(()=>{
                this.remove();
                resolve();
            },300);
        });
    }

    open(buttons:XModalButtons){

        this._shadow.innerHTML = "";

        let eb = Tools.ElementBuilder;

        let s = eb("link",{
            href: "/public/styles/xmodal.css",
            rel: "stylesheet"
        }).create();
        let h3 = eb("h3", this._title).create();
        let p = eb("p", this._message).create();
        let div = eb("div").create(el => {

            Object.keys(buttons).forEach(buttonIdentifier => {

                let buttonInfo = buttons[buttonIdentifier];

                let button = eb("button",{
                    id: buttonIdentifier,
                    class: this._getButtonClass(buttonInfo.type)
                }, buttonInfo.text).create();

                if (buttonInfo.callback){
                    button.addEventListener("click", (e)=>{
                        buttonInfo.callback(e);
                        this.close();
                    });
                }
                else{
                    this.close();
                }

                el.appendChild(button);

            });

        });

        this._shadow.appendChild(s);
        this._shadow.appendChild(h3);
        this._shadow.appendChild(p);
        this._shadow.appendChild(div);

        if (!this._isAttached){
            document.body.appendChild(this);
        }
    }

}

customElements.define('x-modal', XModal);