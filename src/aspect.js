"use strict";
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
exports.Aspects = void 0;
var ASPECTS_SYMBOL = Symbol('miniprojen-aspects');
var Aspects = /** @class */ (function () {
    function Aspects(scope) {
        this.scope = scope;
        this._aspects = new Array();
    }
    Aspects.of = function (scope) {
        var aspects = scope[ASPECTS_SYMBOL];
        if (!aspects) {
            aspects = new Aspects(scope);
            Object.defineProperty(scope, ASPECTS_SYMBOL, {
                value: aspects,
                configurable: false,
                enumerable: false,
            });
        }
        return aspects;
    };
    Aspects.prototype.add = function (aspect) {
        this._aspects.push(aspect);
    };
    Object.defineProperty(Aspects.prototype, "aspects", {
        get: function () {
            return __spreadArray([], this._aspects, true);
        },
        enumerable: false,
        configurable: true
    });
    return Aspects;
}());
exports.Aspects = Aspects;
