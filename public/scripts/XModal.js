var XModalType;
(function (XModalType) {
    XModalType[XModalType["INFORMATION"] = 0] = "INFORMATION";
    XModalType[XModalType["WARNING"] = 1] = "WARNING";
    XModalType[XModalType["ALERT"] = 2] = "ALERT";
    XModalType[XModalType["QUESTION"] = 3] = "QUESTION";
})(XModalType || (XModalType = {}));
var XModalButtonType;
(function (XModalButtonType) {
    XModalButtonType[XModalButtonType["PRIMARY"] = 0] = "PRIMARY";
    XModalButtonType[XModalButtonType["DANGER"] = 1] = "DANGER";
    XModalButtonType[XModalButtonType["CANCEL"] = 2] = "CANCEL";
})(XModalButtonType || (XModalButtonType = {}));
class XModal extends HTMLElement {
    constructor(message, title = null, type = XModalType.INFORMATION) {
        super();
        this._shadow = null;
        this._title = "";
        this._message = "";
        this._type = XModalType.INFORMATION;
        this._shadow = this.attachShadow({ mode: "closed" });
        this._type = type;
        this._message = message;
        this._title = title ? title : this._getTitle();
    }
    static get observedAttributes() { return ['type', 'open']; }
    _getTitle() {
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
    _getButtonClass(buttonType) {
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
    close() {
        this.setAttribute("open", "close");
        return new Promise(resolve => {
            setTimeout(() => {
                this.remove();
                resolve();
            }, 300);
        });
    }
    open(buttons) {
        this._shadow.innerHTML = "";
        let eb = Tools.ElementBuilder;
        let s = eb("link", {
            href: "/public/styles/xmodal.css",
            rel: "stylesheet"
        }).create();
        let h3 = eb("h3", this._title).create();
        let p = eb("p", this._message).create();
        let div = eb("div").create(el => {
            Object.keys(buttons).forEach(buttonIdentifier => {
                let buttonInfo = buttons[buttonIdentifier];
                let button = eb("button", {
                    id: buttonIdentifier,
                    class: this._getButtonClass(buttonInfo.type)
                }, buttonInfo.text).create();
                button.addEventListener("click", (e) => {
                    if (buttonInfo.callback)
                        buttonInfo.callback(e);
                    this.close();
                });
                el.appendChild(button);
            });
        });
        this._shadow.appendChild(s);
        this._shadow.appendChild(h3);
        this._shadow.appendChild(p);
        this._shadow.appendChild(div);
        if (this.isConnected === false) {
            document.body.appendChild(this);
            setTimeout(() => {
                this.setAttribute("open", "true");
            }, 300);
        }
    }
}
customElements.define('x-modal', XModal);
//# sourceMappingURL=XModal.js.map