"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
//const request = require("./request-promise");
const article_1 = require("./article1");
const user_1 = require("./user1");
const tag_1 = require("./tag1");
const issue_1 = require("./issue1");
const project_1 = require("./project1");
const agile_1 = require("./agile1");
const sprint_1 = require("./sprint1");
const workitem_1 = require("./workitem1");
const comment_1 = require("./comment1");
const http = require('@jetbrains/youtrack-scripting-api/http');

class Youtrack {
    constructor(options) {
        this.defaultRequestOptions = { jar: true, json: true };
        this.defaultRequestOptions = Object.assign({}, this.defaultRequestOptions, { headers: {
                Authorization: `Bearer ${options.token}`
            } });
        this.baseUrl = this.formBaseUrl(options.baseUrl);
        this.articles = new article_1.ArticleEndpoint(this);
        this.users = new user_1.UserEndpoint(this);
        this.tags = new tag_1.TagEndpoint(this);
        this.issues = new issue_1.IssueEndpoint(this);
        this.projects = new project_1.ProjectEndpoint(this);
        this.agiles = new agile_1.AgileEndpoint(this);
        this.sprints = new sprint_1.SprintEndpoint(this);
        this.workItems = new workitem_1.WorkItemEndpoint(this);
        this.comments = new comment_1.CommentEndpoint(this);
    }
    prepareConnection(connection, headers){
        var connection = new http.Connection(this.baseUrl);

        if (connection.url != this.baseUrl){
            throw 'Connection not property set up!';
        }

        connection.addHeader({name: 'Content-Type', value: 'application/json'});
        connection.addHeader({name: 'Accept', value: 'application/json'});
        
        for (const key in headers) {
            if (Object.hasOwnProperty.call(headers, key)) {
                const value = headers[key];
                
                connection.addHeader({name: key, value: value});
            }
        }  

        for (const key in this.defaultRequestOptions.headers) {
            if (Object.hasOwnProperty.call(this.defaultRequestOptions.headers, key)) {
                const value = this.defaultRequestOptions.headers[key];
                
                connection.addHeader({name: key, value: value});
            }
        }

        return connection;    
    }
    post(url, params = {}, headers = {}) {
        
        const connection = this.prepareConnection(headers);        
        return connection.postSync(url, params.qs, params.body);
    }
    get(url, params = {}, headers = {}) {
        const connection = this.prepareConnection(headers);  
        return connection.getSync(url, params.qs);
    }
    delete(url, params = {}, headers = {}) {
        const connection = this.prepareConnection(headers);  
        return connection.deleteSync(url, params.qs);
    }
    put(url, params = {}, headers = {}) {
        const connection = this.prepareConnection(headers);  
        return connection.putSync(url, params.qs, params.body);
    }
    formBaseUrl(baseUrl) {
        if (baseUrl.match(/\/$/)) {
            baseUrl = baseUrl.slice(0, -1);
        }
        if (!baseUrl.match(/api$/i)) {
            baseUrl += "/api";
        }
        return baseUrl;
    }
    prepareParams(params, customHeaders) {
        if ('headers' in this.defaultRequestOptions && Object.keys(customHeaders).length > 0) {
            // merge the header parameters
            const _a = this.defaultRequestOptions, { headers } = _a, defaultOptions = __rest(_a, ["headers"]);
            return Object.assign({}, defaultOptions, params, { headers: Object.assign({}, headers, customHeaders) });
        }
        if ('headers' in this.defaultRequestOptions) {
            return Object.assign({}, this.defaultRequestOptions, params);
        }
        return Object.assign({}, this.defaultRequestOptions, params, { headers: Object.assign({}, customHeaders) });
    }
}
exports.Youtrack = Youtrack;
