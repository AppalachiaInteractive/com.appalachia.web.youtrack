const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Clean Up Names',
  command: 'action-cleanup-names',
  guard: (ctx) => true,
  action: (ctx) => {
    const issue = ctx.issue;
    
    prefixes = [
      'Crafting - Wood - ',      
      //'World Design - ',
    ];

    for (const prefix of prefixes) {
       if (issue.summary.includes(prefix)) {
         issue.summary = issue.summary.replace(prefix, '').trim();
       }
    }
    
    pairs = {
      "'":"",          
};

    for (const [f, r] of Object.entries(pairs)) {
      if (issue.summary.includes(f)) {
        issue.summary = issue.summary.replace(f, r).trim();
      }
    }
    
    types = ['depends on', 'parent for'];

    for (const linkType of types) {

      if (!(linkType in issue.links)) {
        continue;
      }

      const links = issue.links[linkType];

      links.forEach(link => {
        for (const [f, r] of Object.entries(pairs)) {
        if (link.summary.includes(f)) {
          link.summary = link.summary.replace(f, r).trim();
        }
      } 
      });
    }
  },
  requirements: appalachia.requirements.none
});