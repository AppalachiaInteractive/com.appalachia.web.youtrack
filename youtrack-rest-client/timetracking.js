"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base1");
class TimetrackingEndpoint extends base_1.BaseEndpoint {
    get() {
        return this.toPromise(this.client.get('/admin/timetracking')).then(response => {
            return response;
        });
    }
}
exports.TimetrackingEndpoint = TimetrackingEndpoint;
