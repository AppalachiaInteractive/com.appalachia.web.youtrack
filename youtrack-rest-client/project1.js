"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base1");
const __1 = require("./project");
const workItem_1 = require("./workitem");
exports.ProjectPaths = {
    projects: '/admin/projects',
    project: '/admin/projects/{projectId}',
    workItemTypes: '/admin/projects/{projectId}/timeTrackingSettings/workItemTypes'
};
class ProjectEndpoint extends base_1.BaseEndpoint {
    all(paginationOptions = {}) {
        return this.getResourceWithFields(exports.ProjectPaths.projects, __1.ReducedProjectImpl, { qs: paginationOptions });
    }
    byId(projectId) {
        return this.getResourceWithFields(this.format(exports.ProjectPaths.project, { projectId }), __1.ProjectImpl);
    }
    getWorkItemTypes(projectId) {
        return this.getResourceWithFields(this.format(exports.ProjectPaths.workItemTypes, { projectId }), workItem_1.WorkItemTypeImpl);
    }
}
exports.ProjectEndpoint = ProjectEndpoint;
