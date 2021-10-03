"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base1");
const __1 = require("./sprint");
exports.SprintPaths = {
    sprints: '/agiles/{agileId}/sprints',
    sprint: '/agiles/{agileId}/sprints/{sprintId}'
};
class SprintEndpoint extends base_1.BaseEndpoint {
    all(agileId, paginationOptions = {}) {
        return this.getResourceWithFields(this.format(exports.SprintPaths.sprints, { agileId }), __1.ReducedSprintImpl, { qs: paginationOptions });
    }
    byId(agileId, sprintId) {
        return this.getResourceWithFields(this.format(exports.SprintPaths.sprint, { agileId, sprintId }), __1.SprintImpl);
    }
    delete(agileId, sprintId) {
        return this.toPromise(this.client.delete(this.format(exports.SprintPaths.sprint, { agileId, sprintId })));
    }
    create(agileId, sprint) {
        return this.postResourceWithFields(this.format(exports.SprintPaths.sprints, { agileId }), __1.SprintImpl, {
            body: sprint
        });
    }
    update(agileId, sprint) {
        return this.postResourceWithFields(this.format(exports.SprintPaths.sprint, {
            agileId, sprintId: sprint.id
        }), __1.SprintImpl, {
            body: sprint
        });
    }
}
exports.SprintEndpoint = SprintEndpoint;
