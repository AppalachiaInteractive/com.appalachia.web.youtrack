const entities = require("@jetbrains/youtrack-scripting-api/entities");
const appalachia = require("youtrack-appalachia/appalachia");

exports.rule = entities.Issue.action({
  title: "Include Dependencies in Feature Release",
  command: "dependencies-in-feature-release",
  guard: (ctx) => appalachia.guard.allowAll,
  action: (ctx) => {
    appalachia.setDependencyReleases(ctx.issue, true);
  },
  requirements: appalachia.requirements.anyProject,
});
