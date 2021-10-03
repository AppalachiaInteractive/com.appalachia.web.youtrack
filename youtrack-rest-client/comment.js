"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
const issue_1 = require("./issue");
// TODO: add attachment and visibilty typings
class IssueCommentImpl {
    constructor() {
        this.author = new user_1.ReducedUserImpl();
        this.deleted = false;
        this.issue = new issue_1.ReducedIssueImpl();
        this.attachments = [];
        this.created = 0;
        this.id = '';
        this.text = '';
        this.textPreview = '';
        this.updated = 0;
        this.usesMarkdown = false;
        this.visibility = null;
    }
}
exports.IssueCommentImpl = IssueCommentImpl;
