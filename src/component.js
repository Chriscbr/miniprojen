"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
var Component = /** @class */ (function () {
    function Component(project) {
        this.project = project;
        project._addComponent(this);
    }
    Component.prototype.synthesize = function () { };
    return Component;
}());
exports.Component = Component;
