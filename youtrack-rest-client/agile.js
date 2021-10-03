"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = require("./project");
const user_1 = require("./user");
const sprint_1 = require("./sprint");
class ReducedAgileImpl {
    constructor() {
        this.id = '';
        this.name = '';
        this.owner = new user_1.ReducedUserImpl();
        this.projects = [new project_1.ReducedProjectImpl()];
        this.sprints = [new sprint_1.ReducedSprintImpl()];
        this.currentSprint = new sprint_1.ReducedSprintImpl();
    }
}
exports.ReducedAgileImpl = ReducedAgileImpl;
class AgileImpl extends ReducedAgileImpl {
    constructor() {
        super(...arguments);
        this.orphansAtTheTop = false;
        this.hideOrphansSwimlane = false;
    }
}
exports.AgileImpl = AgileImpl;
