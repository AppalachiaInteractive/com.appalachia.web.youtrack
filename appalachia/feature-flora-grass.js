const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Populate Grass Feature',
  command: 'feature-flora-grass',
  guard: appalachia.guards.grass,
  action: (ctx) => {
    
    const entries = appalachia.features.getGrass();

    appalachia.populate.createComplexIssues(
      ctx,
      ctx.issue, 
      entries, 
      ['VFX-17','VFX-21','VFX-22','PKG-91'],
      ['Flora', 'Flora: Grass']
      );
  },
  requirements: appalachia.requirements.featureRoadmap
});
