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
exports.Project = void 0;
const constructs_1 = require("constructs");
const path = __importStar(require("path"));
const cleanup_1 = require("./cleanup");
const component_1 = require("./component");
class Project extends constructs_1.Construct {
    constructor(options) {
        var _a;
        super(undefined, '');
        this.name = options.name;
        this.outdir = path.resolve((_a = options.outdir) !== null && _a !== void 0 ? _a : '.');
    }
    static of(c) {
        if (c instanceof Project) {
            return c;
        }
        const parent = c.node.scope;
        if (!parent) {
            throw new Error('cannot find a parent project (directly or indirectly)');
        }
        return Project.of(parent);
    }
    synth() {
        console.log('Synthesizing project...');
        (0, cleanup_1.cleanup)(this.outdir, []);
        for (const child of this.node.children) {
            if (child instanceof component_1.Component) {
                child.synthesize();
            }
        }
        console.log('Synthesis complete.');
    }
}
exports.Project = Project;
