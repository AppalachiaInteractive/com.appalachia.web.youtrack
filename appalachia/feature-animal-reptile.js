const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Populate Reptile + Amphibian Feature',
  command: 'feature-animal-reptile',
  guard: appalachia.guards.reptile,
  action: (ctx) => {    

    const entries = appalachia.features.getReptile();

    appalachia.populate.createComplexIssues(
      ctx,
      ctx.issue, 
      entries, 
      ['VFX-73','AI-1','AI-12'],
      ['Fauna', 'Fauna: Reptile + Amphibian']
      );
  },
  requirements: appalachia.requirements.featureRoadmap
});