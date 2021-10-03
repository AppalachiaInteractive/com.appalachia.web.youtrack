"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base1");
const __1 = require("./article");
exports.ArticlePaths = {
    article: '/articles/{articleId}',
    articles: '/articles',
};
class ArticleEndpoint extends base_1.BaseEndpoint {
    byId(articleId) {
        return this.getResourceWithFields(this.format(exports.ArticlePaths.article, { articleId }), __1.ArticleImpl);
    }
    search(query, paginationOptions = {}) {
        return this.getResourceWithFields(exports.ArticlePaths.articles, __1.ReducedArticleImpl, {
            qs: Object.assign({ query }, paginationOptions)
        });
    }
    delete(articleId) {
        return this.toPromise(this.client.delete(this.format(exports.ArticlePaths.article, { articleId })));
    }
    create(article) {
        return this.postResourceWithFields(exports.ArticlePaths.articles, __1.ArticleImpl, {
            body: article
        });
    }
    update(article) {
        return this.postResourceWithFields(this.format(exports.ArticlePaths.article, { articleId: article.idReadable }), __1.ArticleImpl, {
            body: article
        });
    }
}
exports.ArticleEndpoint = ArticleEndpoint;
