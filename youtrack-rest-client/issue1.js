"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base1");
const __1 = require("./issue");
const command_1 = require("./command");
exports.IssuePaths = {
    issue: '/issues/{issueId}',
    issues: '/issues',
};
exports.CommandPaths = {
    commands: '/commands'
};
class IssueEndpoint extends base_1.BaseEndpoint {
    byId(issueId) {
        return this.getResourceWithFields(this.format(exports.IssuePaths.issue, { issueId }), __1.IssueImpl);
    }
    search(query, paginationOptions = {}) {
        return this.getResourceWithFields(exports.IssuePaths.issues, __1.ReducedIssueImpl, {
            qs: Object.assign({ query }, paginationOptions)
        });
    }
    delete(issueId) {
        return this.toPromise(this.client.delete(this.format(exports.IssuePaths.issue, { issueId })));
    }
    create(issue) {
        return this.postResourceWithFields(exports.IssuePaths.issues, __1.IssueImpl, {
            body: issue
        });
    }
    update(issue) {
        return this.postResourceWithFields(this.format(exports.IssuePaths.issue, { issueId: issue.id }), __1.IssueImpl, {
            body: issue
        });
    }
    executeCommand(command) {
        return this.postResourceWithFields(exports.CommandPaths.commands, command_1.CommandListImpl, {
            body: command
        });
    }
}
exports.IssueEndpoint = IssueEndpoint;
