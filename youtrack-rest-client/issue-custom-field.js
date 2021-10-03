"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fieldStyle_1 = require("./field-style");
const projectCustomField_1 = require("./project-custom-field");
class IssueCustomFieldValueImpl {
    constructor() {
        this.id = '';
        this.name = '';
        this.localizedName = '';
        this.fullName = '';
        this.login = '';
        this.avatarUrl = '';
        this.isResolved = false;
        this.color = new fieldStyle_1.FieldStyleImpl();
        this.text = '';
    }
}
exports.IssueCustomFieldValueImpl = IssueCustomFieldValueImpl;
class IssueCustomFieldImpl {
    constructor() {
        this.id = '';
        this.projectCustomField = new projectCustomField_1.ProjectCustomFieldImpl();
        this.value = new IssueCustomFieldValueImpl();
        this.$type = '';
        this.name = '';
    }
}
exports.IssueCustomFieldImpl = IssueCustomFieldImpl;
