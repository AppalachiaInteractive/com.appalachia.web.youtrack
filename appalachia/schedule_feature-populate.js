const appalachia = require('appalachia/appalachia');

 const entities = require('@jetbrains/youtrack-scripting-api/entities');

 exports.rule = entities.Issue.onSchedule({
   // TODO: give the rule a human-readable title
   title: 'Scheduled Feature Population',
   // TODO: define which issues are processed
   search: '#FEATUREPOPULATE',
   // TODO: set the schedule
   // For format details refer to http://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/crontrigger.html
   cron: '0 0/5 * * * ?',
   // TODO: to mute notifications for changes that are applied by this rule, set to true
   muteUpdateNotifications: true,
   guard: (ctx) => {
     // TODO: specify the conditions for executing the rule
     return true;
   },
   action: (ctx) => {
        appalachia.populate.populateFeatures(ctx);
        ctx.issue.removeTag("FEATUREPOPULATE");
    },
   requirements: appalachia.requirements.featureRoadmap
 });