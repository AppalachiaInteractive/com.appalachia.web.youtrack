const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Populate Screen',
  command: 'feature-screen',
  guard: appalachia.guards.screen,
  action: (ctx) => {    
    
    const entries = appalachia.features.getScreen();

    appalachia.populate.createComplexIssues(
      ctx,
      ctx.issue, 
      entries, 
      [],
      ['Screen','UI']
      );

  },
  requirements: appalachia.requirements.featureRoadmap
});