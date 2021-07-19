const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Populate Technology Feature',
  command: 'feature-technology',
  guard: appalachia.guards.technology,
  action: (ctx) => {    
    
    const entries = appalachia.features.getTechnology();

    appalachia.populate.createComplexIssues(
      ctx,
      ctx.issue, 
      entries, 
      [],
      ['Technology']
      );

  },
  requirements: appalachia.requirements.featureRoadmap
});