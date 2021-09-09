const entities = require("@jetbrains/youtrack-scripting-api/entities");
const appalachia = require("appalachia/appalachia");

exports.rule = entities.Issue.action({
  title: "Clear Dependencies",
  command: "action-dependencies-clear",
  guard: (ctx) => true,
  action: (ctx) => {
    const issue = ctx.issue;

    const linkTypes = ["parent for"];

    linkTypes.forEach((linkType) => {
      var issueLinks = issue.links[linkType];

      if (issueLinks !== undefined) {
        issueLinks.forEach(function (issueLink) {
          issueLink.links[linkType].clear();
        });
  
        issue.links[linkType].clear();
      }
    });
  },
  requirements: appalachia.requirements.none,
});
