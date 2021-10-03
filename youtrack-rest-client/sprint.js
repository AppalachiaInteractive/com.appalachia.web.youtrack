"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agile_1 = require("./agile");
const issue_1 = require("./issue");
class ReducedSprintImpl {
    constructor() {
        this.id = '';
        this.name = '';
        this.goal = '';
        this.start = 0;
        this.finish = 0;
        this.archived = false;
        this.unresolvedIssuesCount = 0;
        this.previousSprint = undefined;
    }
}
exports.ReducedSprintImpl = ReducedSprintImpl;
class SprintImpl extends ReducedSprintImpl {
    constructor() {
        super(...arguments);
        this.agile = new agile_1.ReducedAgileImpl();
        this.issues = [new issue_1.ReducedIssueImpl()];
        this.isDefault = false;
    }
}
exports.SprintImpl = SprintImpl;
