"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loadProperties(option, properties) {
    for (let propertyName in properties) {
        if (properties.hasOwnProperty(propertyName))
            if (!isNullOrUndefined(properties[propertyName]))
                option[propertyName] = properties[propertyName];
    }
    return option;
}
exports.loadProperties = loadProperties;
function isNullOrUndefined(value) {
    if (value === void 0)
        return true;
    return value === null;
}
exports.isNullOrUndefined = isNullOrUndefined;
function isEmptyOrUndefined(value) {
    if ((typeof value === "string" || value instanceof String) && value.trim() === "")
        return true;
    return isNullOrUndefined(value);
}
exports.isEmptyOrUndefined = isEmptyOrUndefined;
function isVoid(value) {
    if (value === void 0)
        return true;
    return value === null;
}
exports.isVoid = isVoid;
//# sourceMappingURL=convenienceHelpers.js.map