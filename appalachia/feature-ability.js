const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Populate Ability Feature',
  command: 'feature-ability',
  guard: appalachia.guards.ability,
  action: (ctx) => {    
    
    const entries = appalachia.features.getAbility();

    appalachia.populate.createComplexIssues(
      ctx,
      ctx.issue, 
      entries, 
      [],
      ['Ability']
      );

  },
  requirements: appalachia.requirements.featureRoadmap
});