const entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.action({
  title: 'Clear Dependencies',
  command: 'clear-dependencies',
  guard: (ctx) => {
    return ctx.issue.links['depends on'].isNotEmpty();
  },
  action: (ctx) => {
    const issue = ctx.issue;
    issue.links['depends on'].clear();
  },
  requirements: {
    // TODO: add requirements
  }
});