
namespace Tools{

    interface Attributes{
        [name:string]:number|string|boolean;
    }

    export function ElementBuilder(tagName:string)
    export function ElementBuilder(tagName:string, attributes?:Attributes)
    export function ElementBuilder(tagName:string, innerHtml?:string)
    export function ElementBuilder(tagName:string, attributes?:Attributes, innerHtml?:string)
    export function ElementBuilder(tagName:string, attributesOrInnerHtml?:Attributes|string, innerHtml?:string){

        let x = (typeof attributesOrInnerHtml === "string" || attributesOrInnerHtml instanceof String);

        let elementTagName = tagName;
        let elementAttrs:Attributes = x ? {} : <Attributes>attributesOrInnerHtml;
        let html = x ? <string>attributesOrInnerHtml : "";
        if (innerHtml) html = innerHtml;

        let element = document.createElement(elementTagName);

        Object.keys(elementAttrs).forEach(key => {
            element.setAttribute(key, <string>elementAttrs[key]);
        });

        element.innerHTML = html;

        return {
            create: function(changeInterceptor?:(element:HTMLElement)=>void){
                if (changeInterceptor) changeInterceptor(element);
                return element;
            },
            valueOf: function(){
                return element;
            }
        }

    }

}