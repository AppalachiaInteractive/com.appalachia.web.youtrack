"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
class ReducedIssueTagImpl {
    constructor() {
        this.name = '';
        this.id = '';
    }
}
exports.ReducedIssueTagImpl = ReducedIssueTagImpl;
class IssueTagImpl extends ReducedIssueTagImpl {
    constructor() {
        super(...arguments);
        // visibleFor: UserGroup;
        // updateableBy: UserGroup;
        this.untagOnResolve = false;
        this.owner = new user_1.ReducedUserImpl();
    }
}
exports.IssueTagImpl = IssueTagImpl;
