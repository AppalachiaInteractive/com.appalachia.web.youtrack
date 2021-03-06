"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var urls;
(function (urls) {
    urls.USER_LOGIN = '/user/login';
    urls.USER_CURRENT = '/user/current';
    urls.USER_BY_NAME = '/user/{name}';
    urls.SAVED_SEARCHES = '/user/search';
    urls.TAGS = '/user/tag';
    urls.ISSUE = '/issue/{issue}';
    urls.ISSUE_HISTORY = '/issue/{issue}/history';
    urls.ISSUE_CHANGES = '/issue/{issue}/changes';
    urls.ISSUE_EXISTS = '/issue/{issue}/exists';
    urls.ISSUE_EXECUTE = '/issue/{issue}/execute';
    urls.ISSUE_COMMENTS = '/issue/{issue}/comment';
    urls.ISSUE_COMMENT = '/issue/{issue}/comment/{comment}';
    urls.ISSUES = '/issue';
    urls.PROJECTS = '/project/all';
    urls.PROJECT = '/admin/project/{projectId}';
    urls.WORK_ITEMS = '/issue/{issueId}/timetracking/workitem';
    urls.WORK_ITEM = '/issue/{issueId}/timetracking/workitem/{workItemId}';
})(urls = exports.urls || (exports.urls = {}));
