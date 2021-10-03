"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const issue_1 = require("./issue");
class IssueLinkTypeImpl {
    constructor() {
        this.id = '';
        this.name = '';
        this.sourceToTarget = '';
        this.targetToSource = '';
        this.directed = false;
        this.aggregation = false;
        this.readOnly = false;
    }
}
exports.IssueLinkTypeImpl = IssueLinkTypeImpl;
class IssueLinkImpl {
    constructor() {
        this.id = '';
        this.direction = '';
        this.linkType = new IssueLinkTypeImpl();
        this.issue = new issue_1.ReducedIssueImpl();
        this.issues = [new issue_1.ReducedIssueImpl()];
    }
}
exports.IssueLinkImpl = IssueLinkImpl;
