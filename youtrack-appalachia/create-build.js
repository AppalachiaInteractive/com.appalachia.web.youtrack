const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('youtrack-appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Create Build',
  command: 'create-build',
  guard: (ctx) => appalachia.guards.build,
  action: (ctx) => {    
    const entries = {};
   
    entries['pr-re'] = { pk: 'PROD',    sum: 'Release Plan',            pts: 20, deps: [] };
    entries['pr-pr'] = { pk: 'PROD',    sum: 'Production',              pts: 20, deps: ['pr-re'] };
    entries['un-pr'] = { pk: 'UNITY',   sum: 'Promotional Materials',   pts: 10, deps: ['pr-re'] };
    entries['me-pr'] = { pk: 'MEDIA',   sum: 'Promotional Materials',   pts: 10, deps: ['pr-re','un-pr'] };
    entries['me-so'] = { pk: 'MEDIA',   sum: 'Social Media',            pts: 20, deps: ['pr-re','un-pr','med-pr'] };
    entries['me-ad'] = { pk: 'MEDIA',   sum: 'Advertising',             pts: 20, deps: ['pr-re','un-pr','med-pr'] };
    entries['da-la'] = { pk: 'DATA',    sum: 'Launch Analytics',        pts: 10, deps: ['pr-re'] };
    entries['qa-tp'] = { pk: 'QA',      sum: 'Test Plan',               pts: 20, deps: ['pr-re'] };
    entries['qa-tc'] = { pk: 'QA',      sum: 'Test Coordination',       pts: 10, deps: ['pr-re','qa-tp'] };
    entries['co-as'] = { pk: 'CODE',    sum: 'Asset Bundling',          pts: 10, deps: ['pr-re'] };
    entries['un-as'] = { pk: 'UNITY',   sum: 'Asset Bundling',          pts: 20, deps: ['pr-re'] };
    entries['co-sc'] = { pk: 'CODE',    sum: 'Schema Migration',        pts: 30, deps: ['pr-re'] };
    entries['co-la'] = { pk: 'CONCEPT', sum: 'Launch Symbol',           pts: 10, deps: ['pr-re','pr-pr'] };
    entries['ui-up'] = { pk: 'UI',      sum: 'Update Popup',            pts: 10, deps: ['pr-re','un-pr','me-pr','co-la'] };
    entries['te-ab'] = { pk: 'TECH',    sum: 'Application Buildout',    pts: 20, deps: ['ui-up','co-sc','un-as','co-as'] };
    entries['qa-pl'] = { pk: 'QA',      sum: 'Playthrough Testing',     pts: 40, deps: ['te-ab'] };
    entries['qa-re'] = { pk: 'QA',      sum: 'Regression Testing',      pts: 20, deps: ['te-ab'] };
    entries['qa-sa'] = { pk: 'QA',      sum: 'Saved Game Validation',   pts: 10, deps: ['te-ab'] };
    entries['pk-ve'] = { pk: 'PKG',     sum: 'Versioning & Packaging',  pts: 30, deps: ['te-ab','qa-pl','qa-re','qa-sa'] };
    entries['te-ad'] = { pk: 'TECH',    sum: 'Application Delivery',    pts: 20, deps: ['te-ab','pk-ve','qa-pl','qa-re','qa-sa'] };
    entries['pr-ma'] = { pk: 'PROD',    sum: 'Marketplace Integration', pts: 10, deps: ['te-ap'] };
    entries['pr-go'] = { pk: 'PROD',    sum: 'Go Live',                 pts: 10, deps: ['pr-ma','te-ap'] };
    entries['pr-co'] = { pk: 'PROD',    sum: 'Community Management',    pts: 40, deps: ['pr-go'] };
    entries['pr-li'] = { pk: 'PROD',    sum: 'Live Support',            pts: 40, deps: ['pr-go'] };
    entries['pr-ac'] = { pk: 'PROD',    sum: 'Accounting',              pts: 05, deps: ['pr-og'] };
    entries['pr-ro'] = { pk: 'PROD',    sum: 'Royalty Reporting',       pts: 05, deps: ['pr-ac'] };
  
    appalachia.createComplexIssues(ctx.issue, entries);
  },
  requirements: appalachia.requirements.featureRoadmap
});