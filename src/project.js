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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
var path = __importStar(require("path"));
var cleanup_1 = require("./cleanup");
var Project = /** @class */ (function () {
    function Project(options) {
        var _a;
        this._components = new Array();
        this.name = options.name;
        this.outdir = path.resolve((_a = options.outdir) !== null && _a !== void 0 ? _a : '.');
    }
    Object.defineProperty(Project.prototype, "components", {
        get: function () {
            return __spreadArray([], this._components, true);
        },
        enumerable: false,
        configurable: true
    });
    Project.prototype._addComponent = function (component) {
        this._components.push(component);
    };
    Project.prototype.synth = function () {
        console.log('Synthesizing project...');
        (0, cleanup_1.cleanup)(this.outdir, []);
        for (var _i = 0, _a = this._components; _i < _a.length; _i++) {
            var component = _a[_i];
            component.synthesize();
        }
        console.log('Synthesis complete.');
    };
    return Project;
}());
exports.Project = Project;
