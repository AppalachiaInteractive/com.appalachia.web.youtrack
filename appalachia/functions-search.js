const entities = require("@jetbrains/youtrack-scripting-api/entities");
const search = require("@jetbrains/youtrack-scripting-api/search");
const appalachia_entities = require("appalachia/workflow-entities");

function getIssues(ctx, project, query) {
  return search.search(project, query, ctx.currentUser);
}

function getIssue(ctx, project, queries) {
  for (const query of queries) {
    var matches = search.search(project, query, ctx.currentUser);

    if (matches.isNotEmpty()) {
      return matches.first();
    }
  }

  return null;
}

function tagDuplicates(ctx) {

  var lookup = {}
  var projectNames = [ "3D Modeling","Accessibility","Administrative","Animation","Artificial Intelligence","Asset Management and Bundling","Audio SFX","Authenticity and Research","Backend System Code","Build Pipeline and Automation","Concept Art","Data and Analytics","Feature Roadmap","Game Design","Language and Localization","Level Design","Media and Marketing","Music and Soundtrack","Outreach","Package Management","Product Reviews","Production and Management","Project Template","Quality Assurance","Shaders","Support and Community Management","Symbols and Glyphs","Technology","Texturing","Unity3D","User Experience","User Interface","User Interface Concept Art","Visual Effects" ];

  for (const projectName of projectNames) {

    var project = entities.Project.findByName(projectName);
    var pkey = project.key;

    if (!lookup[pkey]) {
      lookup[pkey] = {};
    }

    var issues = getIssues(ctx, project, "order by: updated desc");

    issues.forEach(function(issue) {
      var summary = issue.summary;

      if (!lookup[pkey][summary]) {
        lookup[pkey][summary] = [];
      }

      lookup[pkey][summary].push(issue);
    });

    for (const [pkey, issueGroups] of Object.entries(lookup)) {
      for (const [issueSummary, issues] of Object.entries(issueGroups)) {          
        for (let i = 1; i < issues.length; i++) {
          const issue = issues[i];
          issue.addTag("DUPLICATE");
        }
      }
    }
  }
}

module.exports = {
  getIssues: getIssues,
  getIssue: getIssue,
  tagDuplicates: tagDuplicates
};
