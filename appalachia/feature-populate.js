const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');


exports.rule = entities.Issue.action({
  title: 'Populate Feature',
  command: 'feature-populate',
  guard: (ctx) => true,
  action: (ctx) => appalachia.populate.populateFeatures(ctx),
  requirements: appalachia.requirements.featureRoadmap
});