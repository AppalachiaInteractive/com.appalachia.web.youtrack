"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = require("./project");
const user_1 = require("./user");
const utils_1 = require("./utils");
exports.userFields = Object.getOwnPropertyNames(new user_1.UserImpl());
exports.minimalUserFields = Object.getOwnPropertyNames(new user_1.ReducedUserImpl());
exports.projectFields = utils_1.generateFields(new project_1.ProjectImpl());
