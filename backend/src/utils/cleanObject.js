"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanObj = cleanObj;
function cleanObj(object) {
    return Object.fromEntries(Object.entries(object).filter(function (_a) {
        var _ = _a[0], value = _a[1];
        return value != null;
    }));
}
var use = {
    name: 1,
    age: undefined
};
console.log(cleanObj(use));
