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
})(Tools || (Tools = {}));
//# sourceMappingURL=Tools.js.map