"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const project_1 = require("./project");
const user_1 = require("./user");

class ReducedArticleImpl {
    constructor() {
        this.summary = '';
        this.project = new project_1.ReducedProjectImpl();
        // this.parentArticle = new ReducedArticleImpl(); 
        this.hasChildren = false;
        this.updated = 0;
        this.created = 0;
        this.idReadable = '';
    }
}
exports.ReducedArticleImpl = ReducedArticleImpl;

class ArticleImpl extends ReducedArticleImpl {
    constructor() {
        super(...arguments);
        
        this.reporter = new user_1.ReducedUserImpl();
        this.updatedBy = new user_1.ReducedUserImpl();
        this.content = '';
        // this.childArticles = [new ArticleImpl()];
        this.ordinal = 0;
        this.hasStar = false;
    }
}
exports.ArticleImpl = ArticleImpl;
