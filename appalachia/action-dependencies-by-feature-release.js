const entities = require("@jetbrains/youtrack-scripting-api/entities");
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: "Include Dependencies In Feature Release If Not Earlier",
  command: "action-dependencies-by-feature-release",
  guard: appalachia.guards.allowAll,
  action: (ctx) => {
    appalachia.functions.setDependencyReleases(ctx.issue, false);
  },
  requirements: appalachia.requirements.anyProject,
});
