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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanup = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const minimatch_1 = __importDefault(require("minimatch"));
const common_1 = require("./common");
function cleanup(dir, exclude) {
    try {
        for (const f of findGeneratedFiles(dir, exclude)) {
            fs.removeSync(f);
        }
        // TODO: clean up directories?
    }
    catch (e) {
        if (e instanceof Error) {
            console.log(`Warning: failed to clean up generated files: ${e.stack}`);
        }
    }
}
exports.cleanup = cleanup;
function listFiles(base, exclude) {
    const files = new Array();
    const walk = async (reldir = '.') => {
        const entries = fs.readdirSync(path.join(base, reldir));
        entryLoop: for (const entry of entries) {
            const relpath = path.join(reldir, entry);
            const abspath = path.join(base, relpath);
            for (const pattern of exclude) {
                if ((0, minimatch_1.default)(relpath, pattern, { dot: true })) {
                    continue entryLoop;
                }
            }
            const stat = fs.statSync(abspath);
            if (stat.isDirectory()) {
                walk(relpath);
            }
            else {
                files.push(relpath);
            }
        }
    };
    walk();
    return files;
}
function findGeneratedFiles(dir, exclude) {
    const ignore = [...readGitIgnore(dir), ...exclude, '.git/**'];
    const files = listFiles(dir, ignore);
    const generated = new Array();
    for (const file of files) {
        const contents = fs.readFileSync(file, 'utf-8');
        if (contents.includes(common_1.PROJEN_MARKER)) {
            generated.push(file);
        }
    }
    return generated;
}
function readGitIgnore(dir) {
    const filepath = path.join(dir, '.gitignore');
    if (!fs.pathExistsSync(filepath)) {
        return [];
    }
    debugger;
    return fs.readFileSync(filepath, 'utf-8')
        .split('\n')
        .filter(x => (x === null || x === void 0 ? void 0 : x.trim()) !== '')
        .filter(x => !x.startsWith('#') && !x.startsWith('!'))
        .map(x => x.replace(/^\//, '')) // remove "/" prefix
        .map(x => x.replace(/\/$/, '')) // remove "/" suffix
        .map(x => `${x}\n${x}/**`)
        .join('\n')
        .split('\n');
}
