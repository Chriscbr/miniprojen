"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextFile = void 0;
const file_1 = require("./file");
class TextFile extends file_1.FileBase {
    constructor(scope, name, options) {
        var _a;
        super(scope, name, options);
        this.lines = (_a = options.lines) !== null && _a !== void 0 ? _a : [];
    }
    synthesizeContent() {
        return this.lines.length > 0 ? this.lines.join('\n') : undefined;
    }
}
exports.TextFile = TextFile;
