const entities = require("@jetbrains/youtrack-scripting-api/entities");
const appalachia = require("appalachia/appalachia");

exports.rule = entities.Issue.action({
  title: "Delete Dependencies",
  command: "action-dependencies-delete",
  guard: (ctx) => ctx.currentUser.login == "chris",
  action: (ctx) => {
    const issue = ctx.issue;

    const linkTypes = ["parent for"];

    linkTypes.forEach((specificLinkType) => {

      var linkedIssues = issue.links[specificLinkType];

      if (linkedIssues !== undefined) {
        linkedIssues.forEach(function (linkedIssue) {
          linkedIssue.applyCommand("delete");
        });
      }
    });
  },
  requirements: appalachia.requirements.none,
});
