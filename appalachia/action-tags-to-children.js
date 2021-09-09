const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Push Tags to Children',
  command: 'action-tags-to-children',
  guard: (ctx) => true,
  action: (ctx) => {
    const issue = ctx.issue;
    const links = issue.links['parent for'];

    links.forEach(function (link) {
      
      issue.tags.forEach(function (tag) {
        link.addTag(tag.name)
      });      
    });
  },
  requirements: appalachia.requirements.none
});