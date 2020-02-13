"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("./AppError");
const System_1 = require("./System");
let fs = require("fs");
let path = require("path");
class TempFile {
    constructor() {
        this._shouldKeep = false;
        setTimeout(() => {
            if (this._shouldKeep === false)
                this.destroy();
        }, 15000).unref();
    }
    get exists() {
        return fs.existsSync(this.destinationPath);
    }
    static createFrom(file) {
        let f = new TempFile();
        f.originalName = file['originalname'];
        f.encoding = file['encoding'];
        f.mimeType = file['mimetype'];
        f.size = file['size'];
        f.destinationPath = file['path'];
        f.buffer = file['buffer'];
        f.uniqueName = path.basename(file['path']);
        return f;
    }
    keep() {
        if (this.exists === false)
            throw new AppError_1.AppError("The incoming file is no longer available");
        this._shouldKeep = true;
    }
    destroy() {
        fs.unlinkSync(this.destinationPath);
    }
}
class handler {
    constructor() {
        this._files = [];
    }
    setIncomingFiles(f) {
        var _a;
        if (fs.existsSync(System_1.System.storagePath) === false)
            fs.mkdirSync(System_1.System.storagePath);
        this._files = (_a = f) === null || _a === void 0 ? void 0 : _a.map(file => TempFile.createFrom(file));
    }
    getIncomingFiles() {
        return this._files;
    }
}
exports.FSManager = new handler();
//# sourceMappingURL=FSManager.js.map