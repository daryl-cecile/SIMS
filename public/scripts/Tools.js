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
})(Tools || (Tools = {}));
//# sourceMappingURL=Tools.js.map