"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base1");
const comment_1 = require("./comment");
exports.CommentPaths = {
    comment: '/issues/{issueId}/comments/{commentId}',
    comments: '/issues/{issueId}/comments'
};
class CommentEndpoint extends base_1.BaseEndpoint {
    all(issueId, paginationOptions = {}) {
        return this.getResourceWithFields(this.format(exports.CommentPaths.comments, { issueId }), comment_1.IssueCommentImpl, { qs: paginationOptions });
    }
    create(issueId, comment) {
        return this.postResourceWithFields(this.format(exports.CommentPaths.comments, { issueId }), comment_1.IssueCommentImpl, {
            body: comment
        });
    }
    update(issueId, comment) {
        return this.postResourceWithFields(this.format(exports.CommentPaths.comment, {
            issueId,
            commentId: comment.id
        }), comment_1.IssueCommentImpl, {
            body: comment
        });
    }
    delete(issueId, commentId) {
        return this.toPromise(this.client.delete(this.format(exports.CommentPaths.comment, { issueId, commentId })));
    }
}
exports.CommentEndpoint = CommentEndpoint;
