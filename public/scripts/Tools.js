var Tools;
(function (Tools) {
    function ElementBuilder(tagName, attributesOrInnerHtml, innerHtml) {
        let x = (typeof attributesOrInnerHtml === "string" || attributesOrInnerHtml instanceof String);
        let elementTagName = tagName;
        let elementAttrs = x ? {} : attributesOrInnerHtml;
        let html = x ? attributesOrInnerHtml : "";
        if (innerHtml)
            html = innerHtml;
        let element = document.createElement(elementTagName);
        if (elementAttrs)
            Object.keys(elementAttrs).forEach(key => {
                element.setAttribute(key, elementAttrs[key]);
            });
        if (html)
            element.innerHTML = html;
        return {
            create: function (changeInterceptor) {
                if (changeInterceptor)
                    changeInterceptor(element);
                return element;
            },
            valueOf: function () {
                return element;
            }
        };
    }
    Tools.ElementBuilder = ElementBuilder;
    Tools.ElementPacker = {
        unpack(e) {
            if (Array.isArray(e)) {
                return e.map(l => this.unpack(l));
            }
            else {
                let k = Object.keys(e)[0];
                let elem = document.createElement(k);
                Object.keys(e[k]).forEach(prop => {
                    if (prop === "html") {
                        if (Array.isArray(e[k][prop])) {
                            e[k][prop].forEach((_, i) => {
                                elem.appendChild(this.unpack(e[k][prop][i]));
                            });
                        }
                        else {
                            elem.innerHTML = e[k][prop];
                        }
                    }
                    else if (prop === "classes") {
                        elem.classList.add(...e[k][prop]);
                    }
                    else if (prop.indexOf("_") === 0) {
                        elem.addEventListener(prop.substr(1), e[k][prop]);
                    }
                    else {
                        elem.setAttribute(prop, e[k][prop]);
                    }
                });
                return elem;
            }
        },
        unpackInto(container, e) {
            if (Array.isArray(e)) {
                e.forEach(k => container.appendChild(this.unpack(k)));
            }
            else {
                container.appendChild(this.unpack(e));
            }
        }
    };
    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0)
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    Tools.getCookie = getCookie;
    function csrfToken() {
        return getCookie("_csrf");
    }
    Tools.csrfToken = csrfToken;
    function ButtonStateSwapper(btn) {
        let content = "";
        let originalPointerEvent = "";
        let l = {
            setLoading: () => {
                content = btn.innerHTML;
                originalPointerEvent = btn.style.pointerEvents;
                btn.innerHTML = `<i class="fas fa-spinner fa-pulse"></i>`;
                btn.style.pointerEvents = "none";
                return l;
            },
            reset: () => {
                btn.innerHTML = content;
                btn.style.pointerEvents = originalPointerEvent;
                return l;
            }
        };
        return l;
    }
    Tools.ButtonStateSwapper = ButtonStateSwapper;
    function DateToDOMCompatString(d) {
        let date = new Date(d);
        return date['toDOMCompatibleDateString']();
    }
    Tools.DateToDOMCompatString = DateToDOMCompatString;
    class Color {
        constructor(hexOrR, g, b, a) {
            if (typeof hexOrR === "string" || hexOrR instanceof String) {
                if (hexOrR[0] === "#")
                    hexOrR = hexOrR.substr(1);
                let parts = [];
                if (hexOrR.length === 3)
                    parts = [...hexOrR.split(""), 1];
                if (hexOrR.length === 6)
                    parts = [...hexOrR.split(/(.{2})/).filter(k => k.length), 1];
                if (hexOrR.length === 8)
                    parts = hexOrR.split(/(.{2})/).filter(k => k.length);
                this.R = parseInt(parts[0], 16);
                this.G = parseInt(parts[1], 16);
                this.B = parseInt(parts[2], 16);
                this.A = parseInt(parts[2], 16) / 255;
            }
            else {
                this.R = hexOrR;
                this.G = g;
                this.B = b;
                this.A = a || 1;
            }
        }
        getPartHex(part) {
            if (part !== "A") {
                return this[part].toString(16).padStart(2, "0").toUpperCase();
            }
            return (this.A * 255).toString(16).padStart(2, "0").toUpperCase();
        }
        get cssHex() {
            return `#${this.getPartHex("R")}${this.getPartHex("G")}${this.getPartHex("B")}`.toUpperCase();
        }
        get cssHexAlpha() {
            return `${this.cssHex}${this.getPartHex("A")}`.toUpperCase();
        }
        get cssRGB() {
            return `rgb(${this.R},${this.G},${this.B})`;
        }
        get cssRGBA() {
            return `rgba(${this.R},${this.G},${this.B},${this.A})`;
        }
        static get RED() {
            return new Color("#ee2318");
        }
        static get ORANGE() {
            return new Color("#E89005");
        }
        static get GREEN() {
            return new Color("#57886C");
        }
        static get BLUE() {
            return new Color("#457B9D");
        }
    }
    Tools.Color = Color;
    function magic(originalObject) {
        const handler = {
            get: (obj, prop) => {
                if (prop === "valueOf") {
                    return () => originalObject;
                }
                else {
                    obj[prop] = obj[prop] || {};
                    if (typeof obj[prop] === "string" || obj[prop] instanceof String) {
                        return obj[prop];
                    }
                    return magic(obj[prop]);
                }
            },
            valueOf: () => {
                return originalObject;
            },
            toString: () => {
                return JSON.stringify(originalObject);
            }
        };
        return new Proxy(originalObject, handler);
    }
    Tools.magic = magic;
})(Tools || (Tools = {}));
Date.prototype['toDOMCompatibleDateString'] = function () {
    return this.toISOString().split("T")[0];
};
//# sourceMappingURL=Tools.js.map