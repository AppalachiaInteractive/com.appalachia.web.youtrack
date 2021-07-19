const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Populate Plant Feature',
  command: 'feature-flora-plant',
  guard: appalachia.guards.plant,
  action: (ctx) => {
    
    const entries = appalachia.features.getPlant();

    appalachia.populate.createComplexIssues(
      ctx,
      ctx.issue, 
      entries, 
      ['VFX-20','VFX-17','PKG-91'],
      ['Flora', 'Flora: Plant']
      );
  },
  requirements: appalachia.requirements.featureRoadmap
});
