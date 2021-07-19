const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Populate HUD',
  command: 'feature-hud',
  guard: appalachia.guards.hud,
  action: (ctx) => {    
    
    const entries = appalachia.features.getHUD();

    appalachia.populate.createComplexIssues(
      ctx,
      ctx.issue, 
      entries, 
      [],
      ['HUD Overlay','UI']
      );

  },
  requirements: appalachia.requirements.featureRoadmap
});