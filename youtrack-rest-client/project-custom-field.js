"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customField_1 = require("./custom-field");
class ProjectCustomFieldImpl {
    constructor() {
        this.canBeEmpty = false;
        this.emptyFieldText = '';
        this.field = new customField_1.CustomFieldImpl();
        this.hasRunningJob = false;
        this.isPublic = false;
        this.ordinal = 0;
        this.id = '';
    }
}
exports.ProjectCustomFieldImpl = ProjectCustomFieldImpl;
