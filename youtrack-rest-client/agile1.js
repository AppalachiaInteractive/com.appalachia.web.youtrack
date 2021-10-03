"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base1");
const __1 = require("./agile");
exports.AgilePaths = {
    agiles: '/agiles',
    agile: '/agiles/{agileId}'
};
class AgileEndpoint extends base_1.BaseEndpoint {
    all(paginationOptions = {}) {
        return this.getResourceWithFields(exports.AgilePaths.agiles, __1.ReducedAgileImpl, { qs: paginationOptions });
    }
    byId(agileId) {
        return this.getResourceWithFields(this.format(exports.AgilePaths.agile, { agileId }), __1.AgileImpl);
    }
    delete(agileId) {
        return this.toPromise(this.client.delete(this.format(exports.AgilePaths.agile, { agileId })));
    }
    create(agile) {
        return this.postResourceWithFields(exports.AgilePaths.agiles, __1.AgileImpl, {
            body: agile
        });
    }
    update(agile) {
        return this.postResourceWithFields(this.format(exports.AgilePaths.agile, { agileId: agile.id }), __1.AgileImpl, {
            body: agile
        });
    }
}
exports.AgileEndpoint = AgileEndpoint;
