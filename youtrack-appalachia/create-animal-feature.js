const entities = require('@jetbrains/youtrack-scripting-api/entities');
const search = require('@jetbrains/youtrack-scripting-api/search');

exports.rule = entities.Issue.action({
  title: 'Create Animal Feature',
  command: 'create-animal-feature',
  guard: (ctx) => {
    const presentation = ctx.issue.fields.Category.presentation;
    return presentation == 'Fish' || 
      presentation == 'Mammal' || 
      presentation == 'Bird' || 
      presentation == 'Reptile & Amphibian';
  },
  action: (ctx) => {
    const issue = ctx.issue;

    const terms = [      
      { term: issue.summary, project: 'Concept Art', points: 10, user: 'bokbok', owner: 'Bok Bok Productions' },
      { term: issue.summary, project: '3D Modeling', points: 10, user: 'chris', owner: 'Appalachia Interactive' },
      { term: issue.summary, project: 'Texturing', points: 10, user: 'chris', owner: 'Appalachia Interactive' },
      { term: issue.summary + ' Rigging', project: 'Animation', points: 10, user: 'chris', owner: 'Appalachia Interactive' },
      { term: issue.summary + ' Animation', project: 'Animation', points: 10, user: 'chris', owner: 'Appalachia Interactive' },
      { term: issue.summary + ' SFX', project: 'Audio, SFX, Music', points: 5, user: 'TBD', owner: null },
      { term: issue.summary + ' Prefab Creation', project: 'Unity3D', points: 5, user: 'chris', owner: 'Appalachia Interactive' },
      { term: issue.summary + ' State Machine', project: 'Unity3D', points: 5, user: 'chris', owner: 'Appalachia Interactive' },
      { term: issue.summary + ' AI Integration', project: 'Unity3D', points: 5, user: 'chris', owner: 'Appalachia Interactive' },
      { term: issue.summary + ' Details Screen', project: 'User Interface', points: 5, user: 'janice', owner: 'Appalachia Interactive' },
      { term: issue.summary, project: 'Quality Assurance', points: 10, user: 'TBD', owner: null }
    ];

  },
  requirements: {
    TargetRelease: {
      name: 'Target Release',
      type: entities.ProjectVersion.fieldType,
      multi: false
    },
    Category: {
      name: 'Category',
      type: entities.EnumField.fieldType,
      multi: false
    },
    Depend: {
      type: entities.IssueLinkPrototype,
      outward: 'is required for',
      inward: 'depends on'
    }
  }
});
