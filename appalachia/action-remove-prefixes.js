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
         issue.summary.replace(prefix, '').trim();
       }
    }

  },
  requirements: appalachia.requirements.none
});