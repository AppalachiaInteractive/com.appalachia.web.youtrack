"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const format = require("./string-template");
const utils_1 = require("./utils");
class BaseEndpoint {
    constructor(client) {
        this.client = client;
    }
    format(template, values) {
        return format(template, values);
    }
    toPromise(request) {
        return request;
        //return Promise.resolve(request.then(response => {
        //    return response;
        //}).catch(error => {
        //    return Promise.reject(error);
        //}));
    }
    getResource(url, params = {}) {
        return this.toPromise(this.client.get(url, params));
    }
    postResource(url, params = {}) {
        return this.toPromise(this.client.post(url, params));
    }
    getResourceWithFields(url, implementation, options = {}) {
        return this.getResource(url, {
            qs: Object.assign({ fields: utils_1.generateFieldsQuery(new implementation()) }, (options.qs || {}))
        });
    }
    postResourceWithFields(url, implementation, options = {}) {
        return this.postResource(url, Object.assign({}, options, { qs: Object.assign({ fields: utils_1.generateFieldsQuery(new implementation()) }, (options.qs || {})) }));
    }
}
exports.BaseEndpoint = BaseEndpoint;
