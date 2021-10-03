"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nestedField = (property, fields) => {
    return `${property}(${fields.join(',')})`;
};
exports.generateFields = (obj) => {
    return Object.getOwnPropertyNames(obj).map(f => {
        const property = obj[f];
        if (typeof property === 'object' && property) {
            if (!Array.isArray(property)) {
                return nestedField(f, exports.generateFields(property));
            }
            else if (property.length > 0) {
                return nestedField(f, exports.generateFields(property[0]));
            }
        }
        return f;
    });
};
exports.generateFieldsQuery = (obj) => {
    return exports.generateFields(obj).join(',');
};
