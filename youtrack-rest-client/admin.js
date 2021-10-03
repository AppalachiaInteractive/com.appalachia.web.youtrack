"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base1");
const timetracking_1 = require("./timetracking");
class AdminEndpoint extends base_1.BaseEndpoint {
    constructor(client) {
        super(client);
        this.client = client;
        this.timetracking = new timetracking_1.TimetrackingEndpoint(this.client);
    }
}
exports.AdminEndpoint = AdminEndpoint;
