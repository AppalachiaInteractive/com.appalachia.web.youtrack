const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Populate Mammal Feature',
  command: 'feature-animal-mammal',
  guard: appalachia.guards.mammal,
  action: (ctx) => {    

    const entries = appalachia.features.getMammal();

    appalachia.populate.createComplexIssues(
      ctx,
      ctx.issue, 
      entries, 
      ['VFX-30','AI-1','AI-12'],
      ['Fauna', 'Fauna: Mammal']
      );
  },
  requirements: appalachia.requirements.featureRoadmap
});