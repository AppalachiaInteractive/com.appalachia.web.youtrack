"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = require("./project");
const user_1 = require("./user");
const issueTag_1 = require("./issue-tag");
const issueLink_1 = require("./issue-link");
const issueCustomField_1 = require("./issue-custom-field");
const comment_1 = require("./comment");
class ReducedIssueImpl {
    constructor() {
        this.id = '';
        this.numberInProject = 0;
        this.created = 0;
        this.updated = 0;
        this.resolved = 0;
        this.project = new project_1.ReducedProjectImpl();
        this.summary = '';
        this.description = '';
    }
}
exports.ReducedIssueImpl = ReducedIssueImpl;
class IssueImpl extends ReducedIssueImpl {
    constructor() {
        super(...arguments);
        this.reporter = new user_1.ReducedUserImpl();
        this.updater = new user_1.ReducedUserImpl();
        this.usesMarkdown = false;
        this.fields = [new issueCustomField_1.IssueCustomFieldImpl()];
        this.isDraft = false;
        this.tags = [new issueTag_1.IssueTagImpl()];
        this.links = [new issueLink_1.IssueLinkImpl()];
        this.comments = [new comment_1.IssueCommentImpl()];
    }
}
exports.IssueImpl = IssueImpl;
