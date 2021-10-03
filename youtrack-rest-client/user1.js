"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base1");
const __1 = require("./user");
exports.UserPaths = {
    current: '/admin/users/me',
    users: '/admin/users',
    user: '/admin/users/{userId}'
};
class UserEndpoint extends base_1.BaseEndpoint {
    current() {
        return this.getResourceWithFields(exports.UserPaths.current, __1.UserImpl);
    }
    all(paginationOptions = {}) {
        return this.getResourceWithFields(exports.UserPaths.users, __1.ReducedUserImpl, { qs: paginationOptions });
    }
    byId(userId) {
        return this.getResourceWithFields(this.format(exports.UserPaths.user, { userId }), __1.UserImpl);
    }
}
exports.UserEndpoint = UserEndpoint;
