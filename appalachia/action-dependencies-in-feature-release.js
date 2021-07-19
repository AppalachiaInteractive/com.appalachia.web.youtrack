const entities = require("@jetbrains/youtrack-scripting-api/entities");
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: "Include Dependencies in Feature Release",
  command: "action-dependencies-in-feature-release",
  guard: appalachia.guards.allowAll,
  action: (ctx) => {
    appalachia.functions.setDependencyReleases(ctx.issue, true);
  },
  requirements: appalachia.requirements.anyProject,
});
