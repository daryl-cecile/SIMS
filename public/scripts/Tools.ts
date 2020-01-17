
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

        if (elementAttrs) Object.keys(elementAttrs).forEach(key => {
            element.setAttribute(key, <string>elementAttrs[key]);
        });

        if (html) element.innerHTML = html;

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

    export function getCookie(name:string){
        /// Adapted from https://www.w3schools.com/js/js_cookies.asp
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    export function csrfToken(){
        return getCookie("_csrf");
    }

    export function ButtonStateSwapper(btn:HTMLElement){
        let content = "";
        let originalPointerEvent = "";
        let l = {
            setLoading : ()=>{
                content = btn.innerHTML;
                originalPointerEvent = btn.style.pointerEvents;
                btn.innerHTML = `<i class="fas fa-spinner fa-pulse"></i>`;
                btn.style.pointerEvents = "none";
                return l;
            },
            reset : ()=>{
                btn.innerHTML = content;
                btn.style.pointerEvents = originalPointerEvent;
                return l;
            }
        };
        return l;
    }

}