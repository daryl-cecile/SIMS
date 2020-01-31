
export type JsonObject = { [keyName:string]:any };
export type StrictJsonObject = { [keyName:string]:string|boolean|number };

export type ErrorCallback<E = Error> = (err:E)=>void;

export type ObjectProperties<O> = { [K in keyof O]?: O[K] };

export function loadProperties<C>(option:C, properties:ObjectProperties<C>):C{
    for (let propertyName in properties){
        if (properties.hasOwnProperty(propertyName))
            if (!isNullOrUndefined(properties[propertyName])) option[propertyName] = properties[propertyName];
    }
    return option;
}

export function isNullOrUndefined(value:any){
    if (value === void 0) return true;
    return value === null;
}

export function isEmptyOrUndefined(value:any){
    if ((typeof value === "string" || value instanceof String) && value.trim() === "") return true;
    return isNullOrUndefined(value);
}

export function isVoid(value:any){
    if (value === void 0) return true;
    return value === null;
}