const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Populate Fungus Feature',
  command: 'feature-flora-fungus',
  guard: appalachia.guards.fungus,
  action: (ctx) => {
    
    const entries = appalachia.features.getFungus();

    appalachia.populate.createComplexIssues(
      ctx,
      ctx.issue, 
      entries, 
      ['VFX-19','VFX-17','PKG-91'],
      ['Flora', 'Flora: Fungus']
      );
  },
  requirements: appalachia.requirements.featureRoadmap
});
