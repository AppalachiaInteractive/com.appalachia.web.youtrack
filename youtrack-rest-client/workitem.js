"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const issue_1 = require("./issue");
const user_1 = require("./user");
class DurationValueImpl {
    constructor() {
        this.presentation = '';
        this.id = '';
        this.minutes = 0;
    }
}
exports.DurationValueImpl = DurationValueImpl;
class WorkItemTypeImpl {
    constructor() {
        this.id = '';
        this.name = '';
        this.autoAttached = false;
    }
}
exports.WorkItemTypeImpl = WorkItemTypeImpl;
class WorkItemImpl {
    constructor() {
        this.id = '';
        this.created = 0;
        this.date = 0;
        this.duration = new DurationValueImpl();
        this.issue = new issue_1.ReducedIssueImpl();
        this.updated = 0;
        this.author = new user_1.ReducedUserImpl();
        this.creator = new user_1.ReducedUserImpl();
        this.text = '';
        this.textPreview = '';
        this.type = new WorkItemTypeImpl();
        this.usesMarkdown = false;
    }
}
exports.WorkItemImpl = WorkItemImpl;
