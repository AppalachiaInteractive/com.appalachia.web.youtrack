const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Populate Fish Feature',
  command: 'feature-animal-fish',
  guard: appalachia.guards.fish,
  action: (ctx) => {    

    const entries = appalachia.features.getFish();

    appalachia.populate.createComplexIssues(
      ctx,
      ctx.issue, 
      entries, 
      ['VFX-32','AI-1','AI-12'],
      ['Fauna', 'Fauna: Fish']
      );
  },
  requirements: appalachia.requirements.featureRoadmap
});