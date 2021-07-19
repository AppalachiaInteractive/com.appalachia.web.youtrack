const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Clear Dependencies',
  command: 'action-dependencies-clear',
  guard: appalachia.guards.hasDependencies,
  action: (ctx) => {
    const issue = ctx.issue;
    issue.links['depends on'].clear();
  },
  requirements: appalachia.requirements.none
});