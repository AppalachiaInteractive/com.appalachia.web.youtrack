const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Populate Tree Feature',
  command: 'feature-flora-tree',
  guard: appalachia.guards.tree,
  action: (ctx) => {
    
    const entries = appalachia.features.getTree();

    appalachia.populate.createComplexIssues(
      ctx,
      ctx.issue, 
      entries, 
      ['VFX-14','VFX-15','VFX-17','PKG-91', 'PKG-145'],
      ['Flora', 'Flora: Tree']
      );
  },
  requirements: appalachia.requirements.featureRoadmap
});
