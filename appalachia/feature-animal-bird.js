const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Populate Bird Feature',
  command: 'feature-animal-bird',
  guard: appalachia.guards.bird,
  action: (ctx) => {    

    const entries = appalachia.features.getBird();

    appalachia.populate.createComplexIssues(
      ctx,
      ctx.issue, 
      entries, 
      ['VFX-31','3D-308','3D-309','3D-310','3D-311','AI-1','AI-12'],
      ['Fauna', 'Fauna: Bird']
      );
  },
  requirements: appalachia.requirements.featureRoadmap
});