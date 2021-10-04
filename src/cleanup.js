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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanup = void 0;
var fs = __importStar(require("fs-extra"));
var path = __importStar(require("path"));
var minimatch_1 = __importDefault(require("minimatch"));
var common_1 = require("./common");
function cleanup(dir, exclude) {
    try {
        for (var _i = 0, _a = findGeneratedFiles(dir, exclude); _i < _a.length; _i++) {
            var f = _a[_i];
            fs.removeSync(f);
        }
        // TODO: clean up directories?
    }
    catch (e) {
        if (e instanceof Error) {
            console.log("Warning: failed to clean up generated files: " + e.stack);
        }
    }
}
exports.cleanup = cleanup;
function listFiles(base, exclude) {
    var _this = this;
    var files = new Array();
    var walk = function (reldir) {
        if (reldir === void 0) { reldir = '.'; }
        return __awaiter(_this, void 0, void 0, function () {
            var entries, _i, entries_1, entry, relpath, abspath, _a, exclude_1, pattern, stat;
            return __generator(this, function (_b) {
                entries = fs.readdirSync(path.join(base, reldir));
                entryLoop: for (_i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                    entry = entries_1[_i];
                    relpath = path.join(reldir, entry);
                    abspath = path.join(base, relpath);
                    for (_a = 0, exclude_1 = exclude; _a < exclude_1.length; _a++) {
                        pattern = exclude_1[_a];
                        if ((0, minimatch_1.default)(relpath, pattern, { dot: true })) {
                            continue entryLoop;
                        }
                    }
                    stat = fs.statSync(abspath);
                    if (stat.isDirectory()) {
                        walk(relpath);
                    }
                    else {
                        files.push(relpath);
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    walk();
    return files;
}
function findGeneratedFiles(dir, exclude) {
    var ignore = __spreadArray(__spreadArray(__spreadArray([], readGitIgnore(dir), true), exclude, true), ['.git/**'], false);
    var files = listFiles(dir, ignore);
    var generated = new Array();
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var contents = fs.readFileSync(file, 'utf-8');
        if (contents.includes(common_1.PROJEN_MARKER)) {
            generated.push(file);
        }
    }
    return generated;
}
function readGitIgnore(dir) {
    var filepath = path.join(dir, '.gitignore');
    if (!fs.pathExistsSync(filepath)) {
        return [];
    }
    debugger;
    return fs.readFileSync(filepath, 'utf-8')
        .split('\n')
        .filter(function (x) { return (x === null || x === void 0 ? void 0 : x.trim()) !== ''; })
        .filter(function (x) { return !x.startsWith('#') && !x.startsWith('!'); })
        .map(function (x) { return x.replace(/^\//, ''); }) // remove "/" prefix
        .map(function (x) { return x.replace(/\/$/, ''); }) // remove "/" suffix
        .map(function (x) { return x + "\n" + x + "/**"; })
        .join('\n')
        .split('\n');
}
