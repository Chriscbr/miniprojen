"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aspects = void 0;
const ASPECTS_SYMBOL = Symbol('miniprojen-aspects');
class Aspects {
    constructor(scope) {
        this.scope = scope;
        this._aspects = new Array();
    }
    static of(scope) {
        let aspects = scope[ASPECTS_SYMBOL];
        if (!aspects) {
            aspects = new Aspects(scope);
            Object.defineProperty(scope, ASPECTS_SYMBOL, {
                value: aspects,
                configurable: false,
                enumerable: false,
            });
        }
        return aspects;
    }
    add(aspect) {
        this._aspects.push(aspect);
    }
    get aspects() {
        return [...this._aspects];
    }
}
exports.Aspects = Aspects;
