const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('youtrack-appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Create Sample Feature',
  command: 'create-feature-sample',
  guard: (ctx) => appalachia.guards.allowAll,
  action: (ctx) => {    
    const entries = {};
    entries['sy-01'] = { pk: 'CODE', sum: '',      pts: 20, deps: [] };
    entries['ui-01'] = { pk: 'UI', sum: '',        pts: 20, deps: ['sy-01'] };
    entries['ui-02'] = { pk: 'UI', sum: 'Overlay', pts: 20, deps: ['ui-01'] };
    entries['qa-01'] = { pk: 'QA', sum: '',        pts: 10, deps: ['sy-01','ui-01','ui-02'] };
   
    appalachia.createComplexIssues(ctx.issue, entries);
  },
  requirements: appalachia.requirements.featureRoadmap
});
