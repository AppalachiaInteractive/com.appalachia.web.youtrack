"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
const projectCustomField_1 = require("./project-custom-field");
class ReducedProjectImpl {
    constructor() {
        this.id = '';
        this.name = '';
        this.shortName = '';
        this.description = '';
        this.archived = false;
    }
}
exports.ReducedProjectImpl = ReducedProjectImpl;
class ProjectImpl extends ReducedProjectImpl {
    constructor() {
        super(...arguments);
        this.createdBy = new user_1.ReducedUserImpl();
        this.fields = [new projectCustomField_1.ProjectCustomFieldImpl()];
        this.fromEmail = '';
        this.hubResourceId = '';
        this.iconUrl = '';
        this.timeTrackingEnabled = false;
        this.leader = new user_1.ReducedUserImpl();
    }
}
exports.ProjectImpl = ProjectImpl;
