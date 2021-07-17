const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('youtrack-appalachia/appalachia');

exports.rule = entities.Issue.action({
  title: 'Create Technology Feature',
  command: 'create-technology-feature',
  guard: (ctx) => appalachia.guards.technology,
  action: (ctx) => {    
    const entries = {};
    entries['ca-te'] = { pk: 'CONCEPT', sum: '',                    pts: 20, deps: [] };

    entries['ca-ga'] = { pk: 'CONCEPT', sum: 'Gameplay',            pts: 20, deps: ['ca-te'] };
    entries['ca-cr'] = { pk: 'CONCEPT', sum: 'Crafting',            pts: 10, deps: ['ca-te'] };

    entries['gd-ga'] = { pk: 'GAME',    sum: 'Gameplay',            pts: 05, deps: ['ca-ga'] };
    entries['gd-ui'] = { pk: 'GAME',    sum: 'User Input',          pts: 05, deps: ['gd-ga'] };
    entries['gd-sy'] = { pk: 'GAME',    sum: 'Symbols & Glyphs',    pts: 01, deps: ['ca-ga','gd-ga'] };
    
    entries['ca-sy'] = { pk: 'CONCEPT', sum: 'Symbols & Glyphs',    pts: 05, deps: ['ca-te','gd-sy'] };    

    entries['gd-an'] = { pk: 'GAME',    sum: 'Animation',           pts: 02, deps: ['gd-ga'] };
    entries['gd-in'] = { pk: 'GAME',    sum: 'Inventory',           pts: 03, deps: ['gd-ga'] };
    entries['gd-cr'] = { pk: 'GAME',    sum: 'Crafting',            pts: 05, deps: ['ca-cr','gd-in','gd-ga'] };
    entries['gd-up'] = { pk: 'GAME',    sum: 'Upgrades',            pts: 05, deps: ['ca-up','gd-in','gd-cr'] };
    entries['gd-wt'] = { pk: 'GAME',    sum: 'Wear & Tear',         pts: 02, deps: ['ca-wt','gd-in','gd-cr'] };
    
    entries['ca-up'] = { pk: 'CONCEPT', sum: 'Upgrades',            pts: 10, deps: ['ca-te','gd-up'] };
    entries['ca-wt'] = { pk: 'CONCEPT', sum: 'Wear & Tear',         pts: 05, deps: ['ca-te','gd-wt'] };

    entries['gd-ac'] = { pk: 'GAME',    sum: 'Achievements',        pts: 05, deps: ['gd-ga'] };
    entries['gd-ex'] = { pk: 'GAME',    sum: 'Experience',          pts: 02, deps: ['gd-ga'] };
    entries['gd-st'] = { pk: 'GAME',    sum: 'Stats',               pts: 02, deps: ['gd-ga'] };
    entries['gd-se'] = { pk: 'GAME',    sum: 'Settings',            pts: 02, deps: ['gd-ga'] };

    entries['3d-te'] = { pk: '3D',      sum: '',                    pts: 15, deps: ['ca-te','ca-ga','gd-ga'] };
    entries['3d-up'] = { pk: '3D',      sum: 'Upgrades',            pts: 10, deps: ['ca-up','gd-up','3d-te'] };
    entries['3d-wt'] = { pk: '3D',      sum: 'Wear & Tear',         pts: 05, deps: ['ca-wt','gd-wt','3d-te'] };

    entries['te-te'] = { pk: 'TEXTURE', sum: '',                    pts: 10, deps: ['3d-te'] };
    entries['te-up'] = { pk: 'TEXTURE', sum: 'Upgrades',            pts: 05, deps: ['3d-up','te-te'] };
    entries['te-wt'] = { pk: 'TEXTURE', sum: 'Wear & Tear',         pts: 05, deps: ['3d-wt','te-te'] };

    entries['an-rg'] = { pk: 'ANIM',    sum: 'Rigging',             pts: 10, deps: ['gd-an','3d-te'] };
    entries['an-an'] = { pk: 'ANIM',    sum: 'Animation',           pts: 10, deps: ['gd-an','an-rg','3d-te'] };
    entries['an-ga'] = { pk: 'ANIM',    sum: 'Gameplay',            pts: 20, deps: ['gd-ga','an-rg','3d-te'] };
    entries['an-cr'] = { pk: 'ANIM',    sum: 'Crafting',            pts: 10, deps: ['gd-cr','an-rg','3d-te','3d-up','3d-wt'] };
    entries['an-wt'] = { pk: 'ANIM',    sum: 'Wear & Tear',         pts: 05, deps: ['gd-wt','an-ga','3d-wt'] };

    entries['ad-ga'] = { pk: 'AUDIO',   sum: 'Gameplay',            pts: 10, deps: ['gd-ga','an-ga'] };
    entries['ad-cr'] = { pk: 'AUDIO',   sum: 'Crafting',            pts: 05, deps: ['gd-cr','an-cr'] };
    entries['ad-wt'] = { pk: 'AUDIO',   sum: 'Wear & Tear',         pts: 05, deps: ['gd-wt','an-wt'] };

    entries['sy-ph'] = { pk: 'CODE',    sum: 'Physics',             pts: 20, deps: ['gd-ga'] };
    entries['sy-ui'] = { pk: 'CODE',    sum: 'User Input',          pts: 05, deps: ['gd-ga'] };
    entries['sy-us'] = { pk: 'CODE',    sum: 'Usage',               pts: 05, deps: ['gd-ga', 'sy-ui'] };
    entries['sy-md'] = { pk: 'CODE',    sum: 'Metadata',            pts: 05, deps: ['gd-ga','gd-an','gd-in','gd-cr','gd-up','gd-wt','gd-ac','gd-ex','gd-st','gd-se'] };
    entries['sy-ga'] = { pk: 'CODE',    sum: 'Gameplay',            pts: 20, deps: ['sy-ui','sy-fi','sy-ph','gd-ga','sy-md'] };
    entries['sy-an'] = { pk: 'CODE',    sum: 'Animation',           pts: 10, deps: ['gd-an','an-an','an-ga'] };
    entries['sy-in'] = { pk: 'CODE',    sum: 'Inventory',           pts: 05, deps: ['gd-in','sy-ga'] };
    entries['sy-cr'] = { pk: 'CODE',    sum: 'Crafting',            pts: 10, deps: ['gd-cr','sy-ga'] };
    entries['sy-up'] = { pk: 'CODE',    sum: 'Upgrades',            pts: 05, deps: ['gd-up','sy-ga'] };
    entries['sy-wt'] = { pk: 'CODE',    sum: 'Wear & Tear',         pts: 05, deps: ['gd-wt','sy-ga'] };
    entries['sy-ex'] = { pk: 'CODE',    sum: 'Experience',          pts: 08, deps: ['gd-ex','sy-ga'] };
    entries['sy-ac'] = { pk: 'CODE',    sum: 'Achievements',        pts: 08, deps: ['gd-ac','sy-ga'] };
    entries['sy-st'] = { pk: 'CODE',    sum: 'Stats',               pts: 08, deps: ['gd-st','sy-ga'] };
    entries['sy-se'] = { pk: 'CODE',    sum: 'Settings',            pts: 05, deps: ['gd-se','sy-ga'] };

    entries['ui-sy'] = { pk: 'UI',      sum: 'Symbols & Gelphs',    pts: 03, deps: ['ca-sy','gd-sy'] };

    entries['u3-as'] = { pk: 'UNITY',   sum: 'Asset Setup',         pts: 03, deps: ['3d-ml','3d-uv','te-te','te-wt','an-rg','an-an','an-ch','an-cr','ad-sf','ad-cr','ui-sy'] };
    entries['u3-md'] = { pk: 'UNITY',   sum: 'Metadata',            pts: 05, deps: ['sy-md'] };
    
    entries['vx-sh'] = { pk: 'VFX',     sum: 'Shading',             pts: 05, deps: ['u3-as'] };
    entries['vx-ma'] = { pk: 'VFX',     sum: 'Materials',           pts: 05, deps: ['vx-sh'] };
    entries['vx-qu'] = { pk: 'VFX',     sum: 'Settings & Quality',  pts: 05, deps: ['vx-sh','vx-ma'] };

    entries['ui-hd'] = { pk: 'UI',      sum: 'HUD Overlay',         pts: 10, deps: ['sy-ph','sy-ui','sy-fi','ga-hd','sy-hd','u3-as','u3-md'] };
    entries['ui-ui'] = { pk: 'UI',      sum: 'User Input',          pts: 05, deps: ['ga-ui','sy-ui'] };
    entries['ui-us'] = { pk: 'UI',      sum: 'Usage',               pts: 05, deps: ['ga-ui','sy-us'] };
    entries['ui-ga'] = { pk: 'UI',      sum: 'Gameplay',            pts: 05, deps: ['ga-ga','sy-ga','u3-as','u3-md'] };
    entries['ui-an'] = { pk: 'UI',      sum: 'Animation',           pts: 05, deps: ['ga-an','sy-an','u3-as','u3-md'] };
    entries['ui-in'] = { pk: 'UI',      sum: 'Inventory',           pts: 10, deps: ['ga-in','sy-in','u3-as','u3-md'] };
    entries['ui-cr'] = { pk: 'UI',      sum: 'Crafting',            pts: 10, deps: ['ga-cr','sy-cr','u3-as','u3-md'] };
    entries['ui-up'] = { pk: 'UI',      sum: 'Upgrades',            pts: 10, deps: ['ga-up','sy-up','u3-as','u3-md'] };
    entries['ui-wt'] = { pk: 'UI',      sum: 'Wear & Tear',         pts: 05, deps: ['ga-wt','sy-wt','u3-as','u3-md'] };
    entries['ui-ex'] = { pk: 'UI',      sum: 'Experience',          pts: 03, deps: ['ga-ex','sy-ex','u3-as','u3-md'] };
    entries['ui-ac'] = { pk: 'UI',      sum: 'Achievements',        pts: 03, deps: ['ga-ac','sy-ac','u3-as','u3-md'] };
    entries['ui-st'] = { pk: 'UI',      sum: 'Stats',               pts: 03, deps: ['ga-st','sy-st','u3-as','u3-md'] };
    entries['ui-se'] = { pk: 'UI',      sum: 'Settings',            pts: 05, deps: ['ga-se','sy-se','u3-as','u3-md'] };

    entries['u3-ui'] = { pk: 'UNITY',   sum: 'User Input',          pts: 05, deps: ['sy-ui','ui-ui'] };
    entries['u3-us'] = { pk: 'UNITY',   sum: 'Usage',               pts: 05, deps: ['sy-us','ui-us'] };
    entries['u3-ga'] = { pk: 'UNITY',   sum: 'Gameplay',            pts: 10, deps: ['sy-ga','ui-ga'] };
    entries['u3-an'] = { pk: 'UNITY',   sum: 'Animation',           pts: 05, deps: ['sy-an','ui-an'] };
    entries['u3-in'] = { pk: 'UNITY',   sum: 'Inventory',           pts: 05, deps: ['sy-in','ui-in'] };
    entries['u3-cr'] = { pk: 'UNITY',   sum: 'Crafting',            pts: 05, deps: ['sy-cr','ui-cr'] };
    entries['u3-up'] = { pk: 'UNITY',   sum: 'Upgrades',            pts: 05, deps: ['sy-up','ui-up'] };
    entries['u3-wt'] = { pk: 'UNITY',   sum: 'Wear & Tear',         pts: 05, deps: ['sy-wt','ui-wt'] };
    entries['u3-ex'] = { pk: 'UNITY',   sum: 'Experience',          pts: 03, deps: ['sy-ex','ui-ex'] };
    entries['u3-ac'] = { pk: 'UNITY',   sum: 'Achievements',        pts: 03, deps: ['sy-ac','ui-ac'] };
    entries['u3-st'] = { pk: 'UNITY',   sum: 'Stats',               pts: 03, deps: ['sy-st','ui-st'] };
    entries['u3-se'] = { pk: 'UNITY',   sum: 'Settings',            pts: 05, deps: ['sy-se','ui-se'] };

    entries['u3-pf'] = { pk: 'UNITY',   sum: 'Prefab Creation',     pts: 10, deps: ['vx-qu','vx-ma','u3-as','u3-md','u3-cr','u3-in','u3-up','u3-an','u3-ac','u3-ex','u3-st'] };
    
    entries['sy-ab'] = { pk: 'CODE',    sum: 'Asset Bundling',      pts: 05, deps: ['sy-md','sy-ga','u3-as','u3-pf'] };

    entries['u3-ab'] = { pk: 'UNITY',   sum: 'Asset Bundling',      pts: 10, deps: ['sy-ab','u3-pf'] };

    entries['qa-ga'] = { pk: 'QA',      sum: 'Gameplay',            pts: 02, deps: ['u3-ab','ui-ga','u3-ga','u3-pf'] };
    entries['qa-an'] = { pk: 'QA',      sum: 'Animation',           pts: 02, deps: ['u3-ab','ui-an','u3-an','u3-pf'] };
    entries['qa-in'] = { pk: 'QA',      sum: 'Inventory',           pts: 02, deps: ['u3-ab','ui-in','u3-in','u3-pf'] };
    entries['qa-cr'] = { pk: 'QA',      sum: 'Crafting',            pts: 02, deps: ['u3-ab','ui-cr','u3-cr','u3-pf'] };
    entries['qa-up'] = { pk: 'QA',      sum: 'Upgrades',            pts: 02, deps: ['u3-ab','ui-up','u3-up','u3-pf'] };
    entries['qa-up'] = { pk: 'QA',      sum: 'Wear & Tear',         pts: 02, deps: ['u3-ab','ui-up','u3-up','u3-pf'] };
    entries['qa-ex'] = { pk: 'QA',      sum: 'Experience',          pts: 02, deps: ['u3-ab','ui-ex','u3-ex','u3-pf'] };
    entries['qa-ac'] = { pk: 'QA',      sum: 'Achievements',        pts: 02, deps: ['u3-ab','ui-ac','u3-ac','u3-pf'] };
    entries['qa-st'] = { pk: 'QA',      sum: 'Stats',               pts: 02, deps: ['u3-ab','ui-st','u3-st','u3-pf'] };
    entries['qa-se'] = { pk: 'QA',      sum: 'Settings',            pts: 02, deps: ['u3-ab','ui-se','u3-se','u3-pf'] };

    entries['da-ua'] = { pk: 'DATA',   sum: 'Usage Analytics',      pts: 05, deps: ['u3-pf'] };
    entries['md-sm'] = { pk: 'MEDIA',   sum: 'Social Media (Shots & Post)',      pts: 05, deps: ['u3-pf'] };
    entries['pr-rp'] = { pk: 'PROD',   sum: 'Release Plan',      pts: 05, deps: ['u3-pf'] };
    entries['re-ac'] = { pk: 'REACT',   sum: 'Authenticity Check',      pts: 10, deps: ['u3-pf'] };

    appalachia.createComplexIssues(ctx.issue, entries);
  },
  requirements: appalachia.requirements.featureRoadmap
});
