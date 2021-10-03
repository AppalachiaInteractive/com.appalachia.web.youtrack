"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const issue_1 = require("./issue");
class CommandListImpl {
    constructor() {
        this.id = '';
        this.caret = 0;
        this.commands = [];
        this.comment = '';
        this.issues = [new issue_1.ReducedIssueImpl()];
        this.query = '';
        this.runAs = '';
        this.silent = false;
        this.suggestions = [];
        this.usesMarkdown = false;
        this.visibility = null;
    }
}
exports.CommandListImpl = CommandListImpl;
