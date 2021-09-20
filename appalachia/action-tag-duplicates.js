const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');


exports.rule = entities.Issue.action({
  title: 'Tag Duplicates',
  command: 'tag-duplicates',
  guard: (ctx) => true,
  action: (ctx) => appalachia.search.tagDuplicates(ctx),
  requirements: appalachia.requirements.featureRoadmap
});