"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base1");
const __1 = require("./workitem");
exports.WorkItemPaths = {
    workitems: '/issues/{issueId}/timeTracking/workItems',
    workitem: '/issues/{issueId}/timeTracking/workItems/{workItemId}'
};
class WorkItemEndpoint extends base_1.BaseEndpoint {
    all(issueId, paginationOptions = {}) {
        return this.getResourceWithFields(this.format(exports.WorkItemPaths.workitems, { issueId }), __1.WorkItemImpl, { qs: paginationOptions });
    }
    create(issueId, workItem) {
        return this.postResourceWithFields(this.format(exports.WorkItemPaths.workitems, { issueId }), __1.WorkItemImpl, {
            body: workItem
        });
    }
    update(issueId, workItem) {
        return this.postResourceWithFields(this.format(exports.WorkItemPaths.workitem, {
            issueId, workItemId: workItem.id
        }), __1.WorkItemImpl, {
            body: workItem
        });
    }
    delete(issueId, workItemId) {
        return this.toPromise(this.client.delete(this.format(exports.WorkItemPaths.workitem, {
            issueId, workItemId
        })));
    }
}
exports.WorkItemEndpoint = WorkItemEndpoint;
