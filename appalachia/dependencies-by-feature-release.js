const entities = require("@jetbrains/youtrack-scripting-api/entities");
const appalachia = require("youtrack-appalachia/appalachia");

exports.rule = entities.Issue.action({
  title: "Include Dependencies In Feature Release If Not Earlier",
  command: "dependencies-by-feature-release",
  guard: (ctx) => appalachia.guard.allowAll,
  action: (ctx) => {
    appalachia.setDependencyReleases(ctx.issue, false);
  },
  requirements: appalachia.requirements.anyProject,
});
