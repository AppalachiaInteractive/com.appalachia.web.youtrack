const entities = require('@jetbrains/youtrack-scripting-api/entities');
const workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Only Appalachia Interactive can verify tasks',
  guard: (ctx) => {
    return ctx.issue.fields.becomes(ctx.State, ctx.State.Verified) || ctx.issue.fields.becomes(ctx.State, ctx.State.Excluded);
  },
  action: (ctx) => {
    const group = entities.UserGroup.findByName('Project Administrators');
    
    var found = false;

    group.users.forEach(function(user) {
        if (user.login == ctx.currentUser.login) {
            found = true;            
        }
      });
	
    var verb = "verify";
    
    if (ctx.issue.fields.becomes(ctx.State, ctx.State.Excluded)) {
      verb = "exclude";
      ctx.issue.fields.Assignee = null;
      ctx.issue.fields.Owner = null;
    }
    
    workflow.check(found, 'Only Appalachia Interactive can ' + verb + ' tasks!');
  },
  requirements: {
    State: {
      type: entities.EnumField.fieldType,
      name: 'State',
      Verified: {},
      Excluded: {}
    }
  }
});