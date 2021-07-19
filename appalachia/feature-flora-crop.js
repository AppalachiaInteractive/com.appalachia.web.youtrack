const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Populate Crop Feature',
  command: 'feature-flora-crop',
  guard: appalachia.guards.crop,
  action: (ctx) => {
    
    const entries = appalachia.features.getCrop();

    appalachia.populate.createComplexIssues(
      ctx,
      ctx.issue, 
      entries, 
      ['VFX-20','VFX-17','PKG-91'],
      ['Flora', 'Flora: Crop']
      );
  },
  requirements: appalachia.requirements.featureRoadmap
});
