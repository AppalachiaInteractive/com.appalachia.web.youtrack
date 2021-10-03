const entities = require('@jetbrains/youtrack-scripting-api/entities');
const client = require('youtrack-rest-client/youtrack');
const articleImpl = require('youtrack-rest-client/article');
const projectImpl = require('youtrack-rest-client/project');
const userImpl = require('youtrack-rest-client/user');
const appa_entities = require('./workflow-entities');

exports.rule = entities.Issue.action({
  title: 'Create Note',
  command: 'action-task-article',
  guard: (ctx) => {
    if (ctx.issue.articleId === null || typeof(ctx.issue.articleId) === 'undefined') {
         return true;
    }
    return false;

  },
  action: (ctx) => {
    const issue = ctx.issue;
    
    // const article = new Article(ctx.currentUser, ctx.issue.project, ctx.issue.summary + ' Notes');
    
    
    const options = {
      token: appa_entities.tokens[ctx.currentUser.login],
      baseUrl: "https://dev.appalachiainteractive.com/youtrack/"
    }
    const youtrack = new client.Youtrack(options);
        
    const reporter = JSON.parse(youtrack.users.current().response);
    const projects = JSON.parse(youtrack.projects.all().response);
    
    var foundProject = {};
    
    for (var project of projects) {      
            
      if (project.shortName == ctx.issue.project.key)
      {
        foundProject = project;
        break;
      }
    }
   
    const article = new articleImpl.ArticleImpl();
    
    article.summary = ctx.issue.summary + ' Notes';
    article.project = foundProject;
    article.reporter = reporter;
    
    const response = youtrack.articles.create(article);
    
    if (response.code != 200) {
      console.log("response.code: " + response.code);
      console.log("response.exception: " + response.exception);
      console.log("response.headers: " + response.headers);
      console.log("response.isSuccess: " + response.isSuccess);
      console.log("response.response: " + response.response);
      
      throw 'Failed to be good!';
    }
    
    const responseArticle = JSON.parse(response.response);
    
    ctx.issue.fields['ArticleID'] = responseArticle.idReadable;
    
    var linkUrl = `https://dev.appalachiainteractive.com/youtrack/articles/${responseArticle.idReadable}`;
    var linkText = responseArticle.idReadable;

    var commentWiki = `Notes can be found here: [${linkUrl} ${linkText}]`;    

    ctx.issue.addComment(commentWiki, ctx.currentUser);
    ctx.issue.addTag('Has Notes');
  },
  requirements: {
    articleId: {
        type: entities.Field.stringType,
        name: 'ArticleId'
    }
  }
});
