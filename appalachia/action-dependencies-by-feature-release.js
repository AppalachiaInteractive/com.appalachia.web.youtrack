const entities = require("@jetbrains/youtrack-scripting-api/entities");
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: "Include Dependencies In Feature Release If Not Earlier",
  command: "action-dependencies-by-feature-release",
  guard: (ctx) => true,
  action: (ctx) => {
    appalachia.dependencies.setDependencyReleases(ctx.issue, "depends on", false);
    appalachia.dependencies.setDependencyReleases(ctx.issue, "parent of", false);
  },
  requirements: appalachia.requirements.anyProject,
});
