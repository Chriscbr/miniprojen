"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileBase = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const common_1 = require("./common");
const component_1 = require("./component");
const project_1 = require("./project");
class FileBase extends component_1.Component {
    constructor(scope, name, options) {
        super(scope, name);
        this.relativePath = options.filePath;
    }
    synthesize() {
        const outdir = project_1.Project.of(this).outdir;
        const filePath = path.join(outdir, this.relativePath);
        const content = this.synthesizeContent();
        if (content === undefined) {
            return; // skip
        }
        if (fs.existsSync(filePath)) {
            fs.chmodSync(filePath, '600');
        }
        fs.mkdirpSync(path.dirname(filePath));
        fs.writeFileSync(filePath, content);
        fs.chmodSync(filePath, '400'); // readonly, not executable
    }
}
exports.FileBase = FileBase;
FileBase.PROJEN_MARKER = `${common_1.PROJEN_MARKER}. To modify, edit ${common_1.PROJEN_RC} and run "npx projen".`;
