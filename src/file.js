"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.File = void 0;
var fs = __importStar(require("fs-extra"));
var path = __importStar(require("path"));
var common_1 = require("./common");
var component_1 = require("./component");
var File = /** @class */ (function (_super) {
    __extends(File, _super);
    function File(project, filePath, options) {
        var _this = _super.call(this, project) || this;
        _this.relativePath = filePath;
        _this.absolutePath = path.resolve(project.outdir, filePath);
        return _this;
    }
    File.prototype.synthesize = function () {
        var outdir = this.project.outdir;
        var filePath = path.join(outdir, this.relativePath);
        var content = this.synthesizeContent();
        if (content === undefined) {
            return; // skip
        }
        if (fs.existsSync(filePath)) {
            fs.chmodSync(filePath, '600');
        }
        fs.mkdirpSync(path.dirname(filePath));
        fs.writeFileSync(filePath, content);
        fs.chmodSync(filePath, '400'); // readonly, not executable
    };
    File.PROJEN_MARKER = common_1.PROJEN_MARKER + ". To modify, edit " + common_1.PROJEN_RC + " and run \"npx projen\".";
    return File;
}(component_1.Component));
exports.File = File;
