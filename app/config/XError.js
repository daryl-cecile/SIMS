"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class XStackFrame {
    constructor() {
        this.isConstructor = false;
        this.isEval = false;
    }
    _parseFileInfo(fileInfoString) {
        var _a, _b;
        let parts = this._getFileInfoParts(fileInfoString).split(",");
        this.fileName = parts[0];
        this.lineNumber = parseInt((_a = parts[1], (_a !== null && _a !== void 0 ? _a : "0")));
        this.columnNumber = parseInt((_b = parts[2], (_b !== null && _b !== void 0 ? _b : "0")));
    }
    _getFileInfoParts(fileInfoString) {
        let r = /\(*([^!]+?):([0-9]+):([0-9])\)*/gm;
        let m = r.exec(fileInfoString);
        if (fileInfoString.trim() === "(<anonymous>)" || fileInfoString.trim() === "<anonymous>") {
            return "<anonymous>,1,0";
        }
        return m[1] + "," + m[2] + "," + m[3];
    }
    parseStackParts(stackParts) {
        stackParts.shift();
        if (stackParts[0] === "new" && stackParts[1].startsWith("(") === false)
            this.isConstructor = true;
        else if (stackParts[0] === "eval" && stackParts[1].startsWith("(eval"))
            this.isEval = true;
        else if (/[a-zA-Z_$][a-zA-Z0-9_$<>]*/g.test(stackParts[0]) && stackParts[0].indexOf("/") === -1)
            this.functionName = stackParts[0];
        if (stackParts.length === 2) {
            this._parseFileInfo(stackParts[1]);
        }
        else if (this.isEval) {
        }
        else {
            this._parseFileInfo(stackParts[stackParts.length - 1]);
        }
    }
}
class XError {
    constructor(error) {
        this.stackFrames = [];
        this.originalError = error;
        let details = [];
        let stacks = error.stack.toString().split(/\r\n|\n/);
        if (stacks[0].indexOf("Error:") === -1) {
            let line = stacks[0];
            while (line.indexOf("Error:") === -1) {
                details.push(stacks.shift());
                line = stacks[0];
            }
        }
        this.details = details.join("\n");
        this.type = stacks[0].split(":")[0];
        this.message = stacks[0].split(": ")[1];
        stacks.shift();
        stacks.forEach(stack => {
            let stackFrame = new XStackFrame();
            let p = this._getParts(stack);
            stackFrame.parseStackParts(p);
            this.stackFrames.push(stackFrame);
        });
    }
    _getParts(str) {
        const regex = /\(.+\)|[^ ]+|\w+/gm;
        let m;
        let f = [];
        while ((m = regex.exec(str)) !== null) {
            if (m.index === regex.lastIndex)
                regex.lastIndex++;
            m.forEach(match => {
                if (match.trim().length !== 0)
                    f.push(match);
            });
        }
        return f;
    }
    static createFrom(error) {
        return (new XError(error));
    }
}
exports.XError = XError;
//# sourceMappingURL=XError.js.map