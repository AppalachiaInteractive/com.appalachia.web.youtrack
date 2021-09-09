const entities = require("@jetbrains/youtrack-scripting-api/entities");
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: "Include Dependencies in Feature Release",
  command: "action-dependencies-in-feature-release",
  guard: (ctx) => true,
  action: (ctx) => {
    appalachia.dependencies.setDependencyReleases(ctx.issue, "depends on", true);
    appalachia.dependencies.setDependencyReleases(ctx.issue, "parent of", true);
  },
  requirements: appalachia.requirements.anyProject,
});
