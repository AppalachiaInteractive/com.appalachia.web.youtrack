const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Populate Build',
  command: 'feature-build',
  guard: appalachia.guards.build,
  action: (ctx) => {    
      
    const entries = appalachia.features.getBuild();

    appalachia.populate.createComplexIssues(
      ctx,
      ctx.issue, 
      entries, 
      [],
      ['Build']
      );
  },
  requirements: appalachia.requirements.featureRoadmap
});