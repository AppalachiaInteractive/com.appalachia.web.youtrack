"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const issueTag_1 = require("./issue-tag");
class ReducedUserImpl {
    constructor() {
        this.email = '';
        this.fullName = '';
        this.login = '';
        this.name = '';
        this.id = '';
    }
}
exports.ReducedUserImpl = ReducedUserImpl;
class UserImpl extends ReducedUserImpl {
    constructor() {
        super(...arguments);
        this.avatarUrl = '';
        this.banned = false;
        this.online = false;
        this.guest = false;
        this.jabberAccountName = '';
        this.ringId = '';
        this.tags = [new issueTag_1.ReducedIssueTagImpl()];
    }
}
exports.UserImpl = UserImpl;
