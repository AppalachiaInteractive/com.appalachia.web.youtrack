const entities = require('@jetbrains/youtrack-scripting-api/entities');
const appalachia = require('appalachia/appalachia');

function validateEntries(entries) {
  for (const [k, v] of Object.entries(entries)) {
    if (v.pts < 1) {
      v.pts = 1;
    }
  }

  if ("pr-rp" in entries) {
    for (const [k, v] of Object.entries(entries)) {
      if (k.startsWith("qa-")) {
        entries["pr-rp"].deps.push(k);
      }
    }
  }
    
  if ("u3-pf" in entries) {
    for (const [k, v] of Object.entries(entries)) {
      if (k.startsWith("u3")) {
        entries['u3-pf'].deps.push(k);
      }
    }

    entries['u3-pf'].deps.push('u3-00');
  }

  if ("qa-00" in entries) {
    for (const [k, v] of Object.entries(entries)) {
      if (k.startsWith("u3-") || 
        k.startsWith("le-") || 
        k.startsWith("sy-") ||
        k.startsWith("ui-")) {
        entries['qa-00'].deps.push(k);
      }
    }
  }
  
  for (const [k, v] of Object.entries(entries)) {
    if (k.startsWith("te-") || 
    k.startsWith("3d-") || 
    k.startsWith("ad-") || 
    k.startsWith("an-")) {
      entries['u3-00'].deps.push(k);
    }
  }

  for (const [k, v] of Object.entries(entries)) {

    v.deps  = [...new Set(v.deps )];

    const index = v.deps.indexOf(k);

    if (index > -1) {
      v.deps.splice(index, 1);
    }    
  }

  return entries;
}

function scalePoints(entries, scale) {
  for (const [key, entry] of Object.entries(entries)) {
    entry.pts = int(entry.pts * scale);
    entries[key] = entry;
  }
}

function scaleTasks(entries, scale, postFixes) {
  for (const [key, entry] of Object.entries(entries)) {
    for (const postFix of postFixes) {
      if (key.endsWith("-" + postFix)) {
        entry.pts = int(entry.pts * scale);
        entries[key] = entry;
        break;
      }
    }
  }
}

function scaleProjects(entries, scale, prefixes) {
  for (const [key, entry] of Object.entries(entries)) {
    for (const prefix of prefixes) {
      if (key.startsWith(prefix + '-')) {
        entry.pts = int(entry.pts * scale);
        entries[key] = entry;
        break;
      }
    }
  }
}

function addBase(entries) {  
  entries['ca-00'] = { pk: 'CONCEPT', sum: '',                    pts: 10, deps: [] };

  entries['ga-00'] = { pk: 'GAME',    sum: 'Feature Design',      pts: 06, deps: ['ca-00'] };

  entries['ga-sy'] = { pk: 'GAME',    sum: 'Symbols + Glyphs',    pts: 02, deps: ['ga-00'] };    
  entries['ca-sy'] = { pk: 'SYMBOL',  sum: 'Symbols + Glyphs',    pts: 04, deps: ['ga-sy'] };    
  entries['ui-sy'] = { pk: 'UI',      sum: 'Symbols + Glyphs',    pts: 02, deps: ['ca-sy'] };

  entries['u3-00'] = { pk: 'ASSET',   sum: 'Asset Setup',         pts: 02, deps: ['ui-sy'] };

  entries['sy-00'] = { pk: 'CODE',    sum: 'System Integration',  pts: 10, deps: ['ga-00'] };
  entries['sy-md'] = { pk: 'CODE',    sum: 'Metadata',            pts: 02, deps: ['sy-00'] };
  entries['u3-md'] = { pk: 'UNITY',   sum: 'Metadata',            pts: 02, deps: ['u3-00','sy-md'] };

  entries['qa-00'] = { pk: 'QA',      sum: '',                    pts: 02, deps: ['u3-00'] };

  entries['pr-rp'] = { pk: 'PROD',    sum: 'Release Plan',        pts: 02, deps: ['qa-00'] };
  entries['da-an'] = { pk: 'DATA',    sum: 'Analytics',           pts: 02, deps: ['u3-pf'] };
  entries['md-sm'] = { pk: 'MEDIA',   sum: 'Media Shots + Post',  pts: 02, deps: ['u3-pf'] };
}

function addExperience(entries) {
  entries['ga-ex'] = { pk: 'GAME',    sum: 'Experience',          pts: 02, deps: ['ga-00'] };
  entries['sy-ex'] = { pk: 'CODE',    sum: 'Experience',          pts: 02, deps: ['ga-ex','sy-00'] };
  entries['ui-ex'] = { pk: 'UI',      sum: 'Experience',          pts: 02, deps: ['sy-ex','u3-00','u3-md'] };
  entries['u3-ex'] = { pk: 'UNITY',   sum: 'Experience',          pts: 02, deps: ['u3-00','ui-ex'] };
  entries['qa-ex'] = { pk: 'QA',      sum: 'Experience',          pts: 02, deps: ['qa-00'] };
}

function addAchievements(entries) {
  entries['ga-ac'] = { pk: 'GAME',    sum: 'Achievements',        pts: 02, deps: ['ga-00'] };
  entries['sy-ac'] = { pk: 'CODE',    sum: 'Achievements',        pts: 02, deps: ['ga-ac','sy-00'] };
  entries['ui-ac'] = { pk: 'UI',      sum: 'Achievements',        pts: 02, deps: ['sy-ac','u3-00','u3-md'] };
  entries['u3-ac'] = { pk: 'UNITY',   sum: 'Achievements',        pts: 02, deps: ['u3-00','ui-ac'] };
  entries['qa-ac'] = { pk: 'QA',      sum: 'Achievements',        pts: 02, deps: ['qa-00'] };
}

function addStats(entries) {
  entries['ga-st'] = { pk: 'GAME',    sum: 'Stats',               pts: 02, deps: ['ga-00'] };
  entries['sy-st'] = { pk: 'CODE',    sum: 'Stats',               pts: 02, deps: ['ga-st','sy-00'] };
  entries['ui-st'] = { pk: 'UI',      sum: 'Stats',               pts: 02, deps: ['sy-st','u3-00','u3-md'] };
  entries['u3-st'] = { pk: 'UNITY',   sum: 'Stats',               pts: 02, deps: ['u3-00','ui-st'] };
  entries['qa-st'] = { pk: 'QA',      sum: 'Stats',               pts: 02, deps: ['qa-00'] };
}

function addSettings(entries) {
  entries['ga-se'] = { pk: 'GAME',    sum: 'Settings',            pts: 02, deps: ['ga-00'] };
  entries['sy-se'] = { pk: 'CODE',    sum: 'Settings',            pts: 02, deps: ['ga-se','sy-00'] };
  entries['ui-se'] = { pk: 'UI',      sum: 'Settings',            pts: 02, deps: ['sy-se','u3-00','u3-md','vx-se'] };
  entries['u3-se'] = { pk: 'UNITY',   sum: 'Settings',            pts: 02, deps: ['u3-00','ui-se'] };
  entries['qa-se'] = { pk: 'QA',      sum: 'Settings',            pts: 02, deps: ['qa-00'] };
}

function addPrefab(entries) {  

  entries['u3-pf'] = { pk: 'UNITY',   sum: 'Prefab Creation',     pts: 08, deps: ['u3-00'] };
}

function addModels(entries) {  

  entries['ca-00'].pts = 20;
  entries['ga-00'].pts = 04;

  entries['3d-00'] = { pk: '3D',      sum: '',                    pts: 20, deps: ['ca-00','ga-00'] };

  entries['te-00'] = { pk: 'TEXTURE', sum: '',                    pts: 20, deps: ['3d-00'] };

  entries['u3-00'] = { pk: 'UNITY',   sum: 'Asset Setup',         pts: 04, deps: ['3d-00','te-00','ui-sy'] };

  entries['vx-00'] = { pk: 'VFX',     sum: 'Shading',             pts: 06, deps: ['u3-00'] };
  entries['vx-ma'] = { pk: 'VFX',     sum: 'Materials',           pts: 06, deps: ['vx-00'] };    

  entries['vx-se'] = { pk: 'VFX',     sum: 'Settings',            pts: 06, deps: ['vx-00','vx-ma','ga-se'] };

  entries['sy-ab'] = { pk: 'CODE',    sum: 'Asset Bundling',      pts: 06, deps: ['u3-pf'] };
  entries['u3-ab'] = { pk: 'UNITY',   sum: 'Asset Bundling',      pts: 06, deps: ['sy-ab'] };


  entries['re-ac'] = { pk: 'AUTH',   sum: 'Authenticity',        pts: 04, deps: ['u3-pf'] };
}

function addAnimation(entries) {  

  entries['ga-an'] = { pk: 'GAME',    sum: 'Animation',           pts: 02, deps: ['ga-00'] };
  entries['an-rg'] = { pk: 'ANIM',    sum: 'Rigging',             pts: 10, deps: ['ga-an'] };
  entries['an-an'] = { pk: 'ANIM',    sum: 'Animation',           pts: 10, deps: ['an-rg'] };
  entries['ad-an'] = { pk: 'AUDIO',   sum: 'Animation',           pts: 04, deps: ['an-an'] };
  entries['u3-an'] = { pk: 'UNITY',   sum: 'Animation',           pts: 10, deps: ['an-an','ad-an'] };
  entries['sy-an'] = { pk: 'CODE',    sum: 'Animation',           pts: 10, deps: ['u3-an'] };
  entries['qa-an'] = { pk: 'QA',      sum: 'Animation',           pts: 02, deps: ['u3-pf','sy-an'] };
}

function addGameplay(entries) {

  entries['ca-00'].pts = 20;
  entries['ga-00'].pts = 06;

  entries['ga-vx'] = { pk: 'GAME',    sum: 'VFX',                 pts: 04, deps: ['ga-00'] };

  entries['an-ga'] = { pk: 'ANIM',    sum: 'Gameplay',            pts: 30, deps: ['ga-00','an-rg','3d-00'] };

  entries['ad-ga'] = { pk: 'AUDIO',   sum: 'Gameplay',            pts: 10, deps: ['ga-00','an-ga'] };

  entries['sy-ph'] = { pk: 'CODE',    sum: 'Physics',             pts: 20, deps: ['ga-00'] };
  entries['sy-ga'] = { pk: 'CODE',    sum: 'Gameplay',            pts: 20, deps: ['sy-00','sy-ph','ga-00'] };

  entries['ui-ga'] = { pk: 'UI',      sum: 'Gameplay',            pts: 10, deps: ['ga-ga','sy-00','u3-00','u3-md'] };

  entries['ui-hd'] = { pk: 'UI',      sum: 'HUD Overlay',         pts: 10, deps: ['sy-ph','sy-ui','sy-fi','ga-hd','sy-hd','u3-00','u3-md'] };
  entries['vx-vx'] = { pk: 'VFX',     sum: 'VFX',                 pts: 10, deps: ['ga-vx', 'u3-00'] };

  entries['u3-ga'] = { pk: 'UNITY',   sum: 'Gameplay',            pts: 10, deps: ['sy-00','ui-ga','vx-vx','ui-hd'] };
  entries['qa-ga'] = { pk: 'QA',      sum: 'Gameplay',            pts: 04, deps: ['qa-00','u3-ab','ui-ga','u3-ga','u3-pf'] };
}

function addUserInput(entries) {  
  entries['ga-ui'] = { pk: 'GAME',    sum: 'User Input',          pts: 04, deps: ['ga-00'] };
  entries['ac-ui'] = { pk: 'ACCESS',  sum: 'User Input',          pts: 04, deps: ['ga-ui'] };
  entries['sy-ui'] = { pk: 'CODE',    sum: 'User Input',          pts: 06, deps: ['ga-ui'] };
  entries['ui-ui'] = { pk: 'UI',      sum: 'User Input',          pts: 06, deps: ['ga-ui'] };
  entries['u3-ui'] = { pk: 'UNITY',   sum: 'User Input',          pts: 06, deps: ['ac-ui','sy-ui','ui-ui'] };
  entries['qa-ui'] = { pk: 'QA',      sum: 'User Input',          pts: 02, deps: ['u3-ui','qa-00'] };
}

function addDetails(entries) {  
  entries['ga-dt'] = { pk: 'GAME',    sum: 'Details',           pts: 04, deps: ['ga-00'] };
  entries['sy-dt'] = { pk: 'CODE',    sum: 'Details',           pts: 04, deps: ['ga-dt'] };
  entries['ui-dt'] = { pk: 'UI',      sum: 'Details',           pts: 04, deps: ['sy-dt','u3-00'] };
  entries['u3-dt'] = { pk: 'UNITY',   sum: 'Details',           pts: 04, deps: ['ui-dt','u3-md'] };
  entries['qa-dt'] = { pk: 'QA',      sum: 'Details',           pts: 02, deps: ['u3-dt','qa-00'] };
}

function addInventory(entries) {  
  entries['ga-in'] = { pk: 'GAME',    sum: 'Inventory',           pts: 04, deps: ['ga-00'] };
  entries['sy-in'] = { pk: 'CODE',    sum: 'Inventory',           pts: 06, deps: ['ga-in'] };
  entries['ui-in'] = { pk: 'UI',      sum: 'Inventory',           pts: 12, deps: ['sy-in','u3-00'] };
  entries['u3-in'] = { pk: 'UNITY',   sum: 'Inventory',           pts: 06, deps: ['ui-in','u3-md'] };
  entries['qa-in'] = { pk: 'QA',      sum: 'Inventory',           pts: 02, deps: ['u3-in','qa-00'] };
}

function addCrafting(entries) {  
  entries['ca-cr'] = { pk: 'CONCEPT', sum: 'Crafting',            pts: 10, deps: ['ca-00'] };
  entries['ga-cr'] = { pk: 'GAME',    sum: 'Crafting',            pts: 06, deps: ['ca-cr','ga-in'] };
  entries['an-cr'] = { pk: 'ANIM',    sum: 'Crafting',            pts: 10, deps: ['ga-cr','an-rg','3d-00','3d-up','3d-wt'] };
  entries['ad-cr'] = { pk: 'AUDIO',   sum: 'Crafting',            pts: 06, deps: ['ga-cr','an-cr'] };
  entries['sy-cr'] = { pk: 'CODE',    sum: 'Crafting',            pts: 10, deps: ['ga-cr','sy-00'] };
  entries['ui-cr'] = { pk: 'UI',      sum: 'Crafting',            pts: 10, deps: ['sy-cr','u3-00','u3-md'] };
  entries['u3-cr'] = { pk: 'UNITY',   sum: 'Crafting',            pts: 06, deps: ['sy-cr','ui-cr'] };
  entries['qa-cr'] = { pk: 'QA',      sum: 'Crafting',            pts: 02, deps: ['u3-cr','qa-00'] };

  entries['ca-wt'] = { pk: 'CONCEPT', sum: 'Wear + Tear',         pts: 05, deps: ['ca-cr'] };
  entries['ga-wt'] = { pk: 'GAME',    sum: 'Wear + Tear',         pts: 03, deps: ['ga-cr','ca-wt','ga-in'] };
  entries['an-wt'] = { pk: 'ANIM',    sum: 'Wear + Tear',         pts: 05, deps: ['an-cr','ga-wt','an-rg','3d-00','3d-up','3d-wt'] };
  entries['3d-wt'] = { pk: '3D',      sum: 'Wear + Tear',         pts: 10, deps: ['ca-00','ga-wt'] };
  entries['te-wt'] = { pk: 'TEXTURE', sum: 'Wear + Tear',         pts: 10, deps: ['3d-00'] };
  entries['ad-wt'] = { pk: 'AUDIO',   sum: 'Wear + Tear',         pts: 03, deps: ['ad-cr','ga-wt','an-wt'] };
  entries['sy-wt'] = { pk: 'CODE',    sum: 'Wear + Tear',         pts: 05, deps: ['sy-cr','ga-wt','sy-00'] };
  entries['ui-wt'] = { pk: 'UI',      sum: 'Wear + Tear',         pts: 05, deps: ['ui-cr','sy-wt','u3-00','u3-md'] };
  entries['u3-wt'] = { pk: 'UNITY',   sum: 'Wear + Tear',         pts: 03, deps: ['u3-cr','sy-wt','ui-wt'] };
  entries['qa-wt'] = { pk: 'QA',      sum: 'Wear + Tear',         pts: 01, deps: ['qa-cr','u3-wt','qa-00'] };
}

function addUpgrades(entries) {  
  entries['ca-up'] = { pk: 'CONCEPT', sum: 'Upgrades',            pts: 10, deps: ['ca-00'] };
  entries['ga-up'] = { pk: 'GAME',    sum: 'Upgrades',            pts: 06, deps: ['ca-up','ga-cr'] };
  entries['3d-up'] = { pk: '3D',      sum: 'Upgrades',            pts: 10, deps: ['ca-up','ga-up','3d-00'] };
  entries['te-up'] = { pk: 'TEXTURE', sum: 'Upgrades',            pts: 10, deps: ['3d-up','te-00'] };
  entries['sy-up'] = { pk: 'CODE',    sum: 'Upgrades',            pts: 06, deps: ['ga-up'] };
  entries['ui-up'] = { pk: 'UI',      sum: 'Upgrades',            pts: 10, deps: ['sy-up','u3-00','u3-md'] };
  entries['u3-up'] = { pk: 'UNITY',   sum: 'Upgrades',            pts: 06, deps: ['sy-up','ui-up'] };
  entries['qa-up'] = { pk: 'QA',      sum: 'Upgrades',            pts: 02, deps: ['u3-up','qa-00'] };
}

function addHarvesting(entries) {
  entries['ca-ha'] = { pk: 'CONCEPT', sum: 'Harvesting',          pts: 10, deps: ['ca-00'] };
  entries['ga-ha'] = { pk: 'GAME',    sum: 'Harvesting',          pts: 06, deps: ['ca-ha','ga-in'] };
  entries['3d-ha'] = { pk: '3D',      sum: 'Harvesting',          pts: 10, deps: ['ca-ha','ga-ha','3d-00'] };
  entries['sy-ha'] = { pk: 'CODE',    sum: 'Harvesting',          pts: 06, deps: ['ga-ha'] };
  entries['ui-ha'] = { pk: 'UI',      sum: 'Harvesting',          pts: 10, deps: ['sy-ha','u3-00','u3-md'] };
  entries['u3-ha'] = { pk: 'UNITY',   sum: 'Harvesting',          pts: 06, deps: ['3d-ha','sy-ha','ui-ha'] };
  entries['qa-ha'] = { pk: 'QA',      sum: 'Harvesting',          pts: 02, deps: ['u3-ha','qa-00'] };
}

function addAI(entries) {
  entries['ai-ai'] = { pk: 'AI',      sum: 'AI',                  pts: 20, deps: [] };
  entries['u3-ai'] = { pk: 'UNITY',   sum: 'AI',                  pts: 06, deps: ['ai-ai','u3-md'] };
  entries['qa-ai'] = { pk: 'QA',      sum: 'AI',                  pts: 04, deps: ['u3-ai','qa-00'] };
}

function addHerd(entries) {
  entries['ai-he'] = { pk: 'AI',      sum: 'Herd Behavior',         pts: 10, deps: ['ai-ai'] };
  entries['u3-he'] = { pk: 'UNITY',   sum: 'Herd Behavior',         pts: 06, deps: ['u3-ai','ai-he','u3-md'] };
  entries['qa-he'] = { pk: 'QA',      sum: 'Herd Behavior',         pts: 04, deps: ['qa-ai','u3-he','qa-00'] };
}

function addSimplePathfinding(entries) {
  entries['ai-pt'] = { pk: 'AI',      sum: 'Pathfinding',         pts: 05, deps: ['ai-ai'] };
  entries['u3-pt'] = { pk: 'UNITY',   sum: 'Pathfinding',         pts: 03, deps: ['u3-ai','ai-pt','u3-md'] };
  entries['qa-pt'] = { pk: 'QA',      sum: 'Pathfinding',         pts: 02, deps: ['qa-ai','u3-pt','qa-00'] };
}

function addPathfinding(entries) {
  entries['ai-pt'] = { pk: 'AI',      sum: 'Pathfinding',         pts: 10, deps: ['ai-ai',] };
  entries['u3-pt'] = { pk: 'UNITY',   sum: 'Pathfinding',         pts: 06, deps: ['u3-ai','ai-pt','u3-md'] };
  entries['qa-pt'] = { pk: 'QA',      sum: 'Pathfinding',         pts: 04, deps: ['qa-ai','u3-pt','qa-00'] };
}

function getPromotion(entries, sharedDeps, sharedTags) {
  
  entries['pr-re'] = { pk: 'PROD',    sum: 'Promotional Plan',        pts: 10, deps: [] };
  entries['un-pr'] = { pk: 'UNITY',   sum: 'Promotional Materials',   pts: 40, deps: ['pr-re'] };
  entries['me-so'] = { pk: 'MEDIA',   sum: 'Social Media',            pts: 20, deps: ['pr-re'] };
  entries['me-po'] = { pk: 'MEDIA',   sum: 'Promotions',              pts: 20, deps: ['pr-re'] };
  entries['me-br'] = { pk: 'MEDIA',   sum: 'Brand Management',        pts: 20, deps: ['pr-re'] };
  entries['me-di'] = { pk: 'MEDIA',   sum: 'Digital Influence',       pts: 20, deps: ['pr-re'] };
  entries['me-pb'] = { pk: 'MEDIA',   sum: 'Public Relations',        pts: 20, deps: ['pr-re'] };
  entries['me-ad'] = { pk: 'MEDIA',   sum: 'Advertising',             pts: 20, deps: ['pr-re'] };
  entries['da-la'] = { pk: 'DATA',    sum: 'Analytics',               pts: 20, deps: ['pr-re'] };
  entries['pr-co'] = { pk: 'LIVE',    sum: 'Community Management',    pts: 20, deps: ['pr-re'] };
  entries['pr-pr'] = { pk: 'PROD',    sum: 'Production',              pts: 40, deps: ['pr-re','un-pr','me-so','me-po','me-br','me-di','me-pb','me-ad','da-la','pr-co'] };

  
  sharedTags.push("Promotion");
}

function getBuild(entries, sharedDeps, sharedTags) {
  entries['pr-re'] = { pk: 'PROD',    sum: 'Feature List',            pts: 10, deps: [] };
  entries['bu-re'] = { pk: 'BUILD',   sum: 'Build Plan',              pts: 20, deps: ['pr-re'] };
  entries['qa-tp'] = { pk: 'QA',      sum: 'Test Plan',               pts: 20, deps: ['pr-re'] };
  entries['co-as'] = { pk: 'CODE',    sum: 'Asset Bundling',          pts: 20, deps: ['pr-re'] };
  entries['un-as'] = { pk: 'UNITY',   sum: 'Asset Bundling',          pts: 20, deps: ['co-as'] };
  entries['co-sc'] = { pk: 'CODE',    sum: 'Schema Migration',        pts: 30, deps: ['bu-re'] };
  entries['co-la'] = { pk: 'CONCEPT', sum: 'Promotional Symbol',      pts: 10, deps: ['pr-re'] };
  entries['ui-up'] = { pk: 'UI',      sum: 'Update Popup',            pts: 10, deps: ['bu-re','co-la'] };
  entries['te-bp'] = { pk: 'TECH',    sum: 'Build Pipeline',          pts: 40, deps: ['bu-re','qa-tp','un-as'] };
  entries['te-ab'] = { pk: 'BUILD',   sum: 'Application Buildout',    pts: 40, deps: ['ui-up','co-sc','te-bp'] };
  entries['qa-pl'] = { pk: 'QA',      sum: 'Playthrough',             pts: 40, deps: ['qa-tp','te-ab'] };
  entries['qa-re'] = { pk: 'QA',      sum: 'Regression',              pts: 40, deps: ['qa-tp','te-ab'] };
  entries['qa-sa'] = { pk: 'QA',      sum: 'Saved Game Validation',   pts: 10, deps: ['qa-tp','te-ab'] };

  sharedTags.push("Build");
}

function getRelease(entries, sharedDeps, sharedTags) {  
  
  entries['pr-re'] = { pk: 'PROD',    sum: 'Release Plan',            pts: 20, deps: [] };
  entries['un-pr'] = { pk: 'UNITY',   sum: 'Promotional Materials',   pts: 20, deps: ['pr-re'] };
  entries['me-so'] = { pk: 'MEDIA',   sum: 'Social Media',            pts: 20, deps: ['un-pr'] };
  entries['me-po'] = { pk: 'MEDIA',   sum: 'Promotions',              pts: 20, deps: ['un-pr'] };
  entries['me-br'] = { pk: 'MEDIA',   sum: 'Brand Management',        pts: 20, deps: ['un-pr'] };
  entries['me-di'] = { pk: 'MEDIA',   sum: 'Digital Influence',       pts: 20, deps: ['un-pr'] };
  entries['me-pb'] = { pk: 'MEDIA',   sum: 'Public Relations',        pts: 20, deps: ['un-pr'] };
  entries['me-ad'] = { pk: 'MEDIA',   sum: 'Advertising',             pts: 20, deps: ['un-pr'] };
  entries['da-la'] = { pk: 'DATA',    sum: 'Analytics',               pts: 20, deps: ['pr-re'] };
  entries['pk-ve'] = { pk: 'PKG',     sum: 'Versioning + Packaging',  pts: 30, deps: ['pr-re'] };
  entries['te-ad'] = { pk: 'TECH',    sum: 'Application Delivery',    pts: 20, deps: ['pk-ve'] };
  entries['pr-ma'] = { pk: 'PROD',    sum: 'Marketplace Integration', pts: 10, deps: ['te-ad'] };
  entries['pr-pr'] = { pk: 'PROD',    sum: 'Production',              pts: 20, deps: ['pr-re','pr-ma'] };
  entries['pr-go'] = { pk: 'LIVE',    sum: 'Go Live',                 pts: 10, deps: ['pr-pr'] };
  
  sharedTags.push("Release");
}

function getPostRelease(entries, sharedDeps, sharedTags) {  
  entries['me-so'] = { pk: 'MEDIA',   sum: 'Social Media',            pts: 20, deps: [] };
  entries['me-po'] = { pk: 'MEDIA',   sum: 'Promotions',              pts: 20, deps: [] };
  entries['me-br'] = { pk: 'MEDIA',   sum: 'Brand Management',        pts: 20, deps: [] };
  entries['me-di'] = { pk: 'MEDIA',   sum: 'Digital Influence',       pts: 20, deps: [] };
  entries['me-pb'] = { pk: 'MEDIA',   sum: 'Public Relations',        pts: 20, deps: [] };
  entries['me-ad'] = { pk: 'MEDIA',   sum: 'Advertising',             pts: 20, deps: [] };
  entries['da-la'] = { pk: 'DATA',    sum: 'Analytics',               pts: 20, deps: [] };
  entries['pr-co'] = { pk: 'LIVE',    sum: 'Community Management',    pts: 40, deps: ['pr-go'] };
  entries['pr-li'] = { pk: 'LIVE',    sum: 'Support',                 pts: 40, deps: ['pr-go'] };
  entries['pr-ac'] = { pk: 'ADMIN',   sum: 'Accounting',              pts: 10, deps: ['pr-go'] };
  entries['pr-ro'] = { pk: 'ADMIN',   sum: 'Royalty Reporting',       pts: 10, deps: ['pr-ac'] };
  entries['pr-pr'] = { pk: 'PROD',    sum: 'Production',              pts: 10, deps: [] };

  sharedTags.push("Post Release");
}

function getLaunch(entries, sharedDeps, sharedTags) {

  getRelease(entries, sharedDeps, sharedTags);

  scalePoints(entries, 2);

  sharedTags.pop();
  sharedTags.push("Launch");
}

function getPostLaunch(entries, sharedDeps, sharedTags) {
  getPostRelease(entries, sharedDeps, sharedTags);

  scalePoints(entries, 2);

  sharedTags.pop();
  sharedTags.push("Post Launch");
}

function getAdministrative(entries, sharedDeps, sharedTags) {
  
}

function getPlatform(entries, sharedDeps, sharedTags) {
  
  entries['ga-00'] = { pk: 'GAME',   sum: 'Features',                pts: 20, deps: [] };
  entries['pr-00'] = { pk: 'PROD',   sum: 'Plan',                    pts: 20, deps: ['ga-00'] };
  entries['bu-00'] = { pk: 'BUILD',  sum: 'Build Configuration',     pts: 20, deps: ['pr-00'] };
  entries['u3-00'] = { pk: 'UNITY',  sum: 'Input Mapping',           pts: 10, deps: ['bu-00'] };
     
  entries['ac-cm'] = { pk: 'ACCESS', sum: 'Compatibility',           pts: 10, deps: ['pr-00',] };
  entries['co-cm'] = { pk: 'CODE',   sum: 'Compatibility',           pts: 30, deps: ['pr-00','ac-cm'] };
  entries['ui-cm'] = { pk: 'UI',     sum: 'Compatibility',           pts: 10, deps: ['pr-00','co-cm'] };
  entries['sh-cm'] = { pk: 'SHADE',  sum: 'Compatibility',           pts: 10, deps: ['pr-00','ui-cm'] };
  entries['vf-cm'] = { pk: 'VFX',    sum: 'Compatibility',           pts: 10, deps: ['pr-00','sh-cm'] };
  entries['u3-cm'] = { pk: 'UNITY',  sum: 'Compatibility',           pts: 10, deps: ['pr-00','vf-cm'] };
  entries['qa-cm'] = { pk: 'QA',     sum: 'Compatibility',           pts: 40, deps: ['pr-00','u3-cm'] };
   
  entries['co-fe'] = { pk: 'CODE',   sum: 'Features',                pts: 30, deps: ['pr-00'] };
  entries['ui-fe'] = { pk: 'UI',     sum: 'Features',                pts: 10, deps: ['pr-00','co-fe'] };
  entries['u3-fe'] = { pk: 'UNITY',  sum: 'Features',                pts: 10, deps: ['pr-00','ui-fe'] };
  entries['qa-fe'] = { pk: 'QA',     sum: 'Features',                pts: 40, deps: ['pr-00','u3-fe'] };
   
  entries['ui-se'] = { pk: 'UI',     sum: 'Settings',                pts: 10, deps: ['pr-00','ui-fe','ui-cm'] };
   
  entries['bu-re'] = { pk: 'BUILD',   sum: 'Build Plan',              pts: 20, deps: ['pr-00','bu-00'] };
  entries['qa-tp'] = { pk: 'QA',      sum: 'Test Plan',               pts: 20, deps: ['pr-00'] };
  entries['co-as'] = { pk: 'CODE',    sum: 'Asset Bundling',          pts: 20, deps: ['pr-00'] };
  entries['un-as'] = { pk: 'UNITY',   sum: 'Asset Bundling',          pts: 20, deps: ['co-as'] };
  entries['co-sc'] = { pk: 'CODE',    sum: 'Schema Migration',        pts: 30, deps: ['bu-re'] };
  entries['co-la'] = { pk: 'CONCEPT', sum: 'Promotional Symbol',      pts: 10, deps: ['pr-00'] };
  entries['ui-up'] = { pk: 'UI',      sum: 'Update Popup',            pts: 10, deps: ['bu-re','co-la'] };
  entries['te-bp'] = { pk: 'TECH',    sum: 'Build Pipeline',          pts: 40, deps: ['bu-re','qa-tp','un-as'] };
  entries['te-ab'] = { pk: 'BUILD',   sum: 'Application Buildout',    pts: 40, deps: ['ui-up','co-sc','te-bp'] };
  entries['qa-pl'] = { pk: 'QA',      sum: 'Playthrough',             pts: 40, deps: ['qa-tp','te-ab'] };
  entries['qa-re'] = { pk: 'QA',      sum: 'Regression',              pts: 40, deps: ['qa-tp','te-ab'] };
  entries['qa-sa'] = { pk: 'QA',      sum: 'Saved Game Validation',   pts: 20, deps: ['qa-tp','te-ab'] };
   
  entries['pr-co'] = { pk: 'PROD',   sum: 'Compliance',              pts: 20, deps: ['pr-00'] };
  entries['qa-co'] = { pk: 'QA',     sum: 'Compliance',              pts: 40, deps: ['qa-pl','qa-re','qa-sa','pr-co'] };
   
  entries['pr-re'] = { pk: 'PROD',   sum: 'Release Plan',            pts: 20, deps: ['pr-co'] };
  entries['un-pr'] = { pk: 'UNITY',  sum: 'Promotional Materials',   pts: 20, deps: ['pr-re'] };
  entries['me-so'] = { pk: 'MEDIA',  sum: 'Social Media',            pts: 20, deps: ['un-pr'] };
  entries['me-po'] = { pk: 'MEDIA',  sum: 'Promotions',              pts: 20, deps: ['un-pr'] };
  entries['me-br'] = { pk: 'MEDIA',  sum: 'Brand Management',        pts: 20, deps: ['un-pr'] };
  entries['me-di'] = { pk: 'MEDIA',  sum: 'Digital Influence',       pts: 20, deps: ['un-pr'] };
  entries['me-pb'] = { pk: 'MEDIA',  sum: 'Public Relations',        pts: 20, deps: ['un-pr'] };
  entries['me-ad'] = { pk: 'MEDIA',  sum: 'Advertising',             pts: 20, deps: ['un-pr'] };
  entries['da-la'] = { pk: 'DATA',   sum: 'Analytics',               pts: 20, deps: ['pr-re'] };
  entries['pk-ve'] = { pk: 'PKG',    sum: 'Versioning + Packaging',  pts: 30, deps: ['pr-re'] };
  entries['te-ad'] = { pk: 'TECH',   sum: 'Application Delivery',    pts: 20, deps: ['pk-ve'] };
  entries['pr-ma'] = { pk: 'PROD',   sum: 'Marketplace Integration', pts: 10, deps: ['te-ad'] };
  entries['pr-pr'] = { pk: 'PROD',   sum: 'Production',              pts: 20, deps: ['pr-re','pr-ma'] };
  entries['pr-go'] = { pk: 'LIVE',   sum: 'Go Live',                 pts: 10, deps: ['pr-pr'] };

  sharedTags.push("Platform");
}

function getCulture(entries, sharedDeps, sharedTags) {  
  entries['00'] = { pk: 'OUT',       sum: 'Booking',                     pts: 10, deps: [] };
  entries['10'] = { pk: 'AUTH',      sum: 'Concepts',                    pts: 25, deps: ['00'] };
  entries['20'] = { pk: 'AUTH',      sum: 'Technology Consulting',       pts: 25, deps: ['10'] };
  entries['30'] = { pk: 'AUTH',      sum: 'Medicine Consulting',         pts: 25, deps: ['10'] };
  entries['99'] = { pk: 'REVIEW',    sum: 'Product Review',              pts: 25, deps: ['20','30'] };

  sharedTags.push("Culture");
}

function getLanguage(entries, sharedDeps, sharedTags) { 
  entries['00'] = { pk: 'OUT',  sum: 'Booking',                  pts: 10, deps: [] };
  entries['sp'] = { pk: 'UI',   sum: 'Script Prep',              pts: 05, deps: [] };
  entries['tr'] = { pk: 'LANG', sum: 'Translation',              pts: 30, deps: ['00','sp'] };
  entries['co'] = { pk: 'CODE', sum: 'Translation Integration',  pts: 05, deps: ['tr'] };
  entries['ui'] = { pk: 'UI',   sum: 'Localization',             pts: 05, deps: ['co'] };
  entries['ad'] = { pk: 'UI',   sum: 'UI Adjustments',           pts: 05, deps: ['ui'] };
  entries['rv'] = { pk: 'LANG', sum: 'Translation Review',       pts: 10, deps: ['ad'] };
  entries['qa'] = { pk: 'QA',   sum: 'Translation QA',           pts: 05, deps: ['rv'] };

  sharedTags.push("Language");
}

function getSystem(entries, sharedDeps, sharedTags) {  
  entries['ga-00'] = { pk: 'GAME',    sum: 'Feature Design',      pts: 10, deps: [] };

  addExperience(entries);  
  addAchievements(entries);
  addStats(entries);
  addSettings(entries);

  entries['sy-00'] = { pk: 'CODE',    sum: 'Architecture',       pts: 20, deps: ['ga-00'] };
  entries['sy-01'] = { pk: 'CODE',    sum: 'Implementation',     pts: 50, deps: ['sy-00'] };
  entries['sy-02'] = { pk: 'CODE',    sum: 'API',                pts: 20, deps: ['sy-01'] };
  entries['sy-md'] = { pk: 'CODE',    sum: 'Metadata',           pts: 10, deps: ['sy-02'] };
  entries['pk-se'] = { pk: 'PKG',     sum: 'Package Setup',      pts: 10, deps: ['sy-md'] };
  entries['u3-md'] = { pk: 'UNITY',   sum: 'Metadata',           pts: 06, deps: ['pk-se'] };
  entries['qa-00'] = { pk: 'QA',      sum: '',                   pts: 10, deps: ['u3-md'] };
  entries['pr-rp'] = { pk: 'PROD',    sum: 'Release Plan',       pts: 04, deps: ['qa-00'] };
  entries['da-an'] = { pk: 'DATA',    sum: 'Analytics',          pts: 04, deps: ['u3-md'] };
  entries['md-sm'] = { pk: 'MEDIA',   sum: 'Media Shots + Post', pts: 04, deps: ['u3-md'] };

  sharedTags.push('System');
}

function addScreen(entries) {
  entries['ca-00'].pts = 20;
  entries['ca-00'].sum = 'UI Concept Art'
  entries['ca-00'].pk = 'UICON';

  entries['ui-ux'] = { pk: 'UX',      sum: 'UX Research',              pts: 20, deps: [] };
  entries['ui-ia'] = { pk: 'UX',      sum: 'Information Architecture', pts: 10, deps: ['ga-00','ui-ux'] };
  entries['sy-00'] = { pk: 'CODE',    sum: 'Framework',                pts: 30, deps: [] };
  entries['sy-ba'] = { pk: 'CODE',    sum: 'Backend API',              pts: 20, deps: ['ui-ia'] };
  entries['ui-pr'] = { pk: 'UI',      sum: 'UI Prototype',             pts: 20, deps: ['ca-00','ui-ux','ui-ia'] };
  entries['ui-fr'] = { pk: 'UI',      sum: 'Frontend Implementation',  pts: 20, deps: ['ui-ia','ui-pr','ui-sy'] };
  entries['ui-un'] = { pk: 'UI',      sum: 'Unit Testing',             pts: 10, deps: ['ui-fr'] };
  entries['ui-ap'] = { pk: 'UI',      sum: 'API Integration',          pts: 10, deps: ['ui-fr','sy-ba'] };
  entries['ui-de'] = { pk: 'UI',      sum: 'Developer Testing',        pts: 10, deps: ['ui-ap','ui-un'] };

  entries['qa-00'].pts = 20;
  entries['qa-00'].deps.push('ui-de');
}

function getScreen(entries, sharedDeps, sharedTags) {  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addScreen(entries);
  addUserInput(entries);

  sharedTags.pop();
  sharedTags.push('UI');
  sharedTags.push('Screen');
}

function getHUD(entries, sharedDeps, sharedTags) {
  addScreen(entries);
  
  scalePoints(entries, 0.5);

  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addHUD(entries);
  addUserInput(entries);
  
  sharedTags.push('UI');
  sharedTags.push('HUD Overlay');
}

function getWorld(entries, sharedDeps, sharedTags) {
  
  getSystem(entries, sharedDeps, sharedTags);
  
  entries['le-00'] = { pk: 'LEVEL',   sum: 'Configuration',         pts: 25, deps: ['u3-md'] };

  sharedTags.length = 0
  sharedTags.push('Environment');
  sharedTags.push('World');
}

function getLevel(entries, sharedDeps, sharedTags) {
  
  entries['ga-00'] = { pk: 'GAME',    sum: 'Design',                pts: 25, deps: [] };
  entries['le-00'] = { pk: 'LEVEL',   sum: 'Terrain',               pts: 25, deps: ['ga-00'] };
  entries['le-as'] = { pk: 'LEVEL',   sum: 'Astronomy',             pts: 10, deps: ['le-00'] };
  entries['le-ri'] = { pk: 'LEVEL',   sum: 'Rivers',                pts: 20, deps: ['le-00'] };
  entries['le-po'] = { pk: 'LEVEL',   sum: 'Ponds',                 pts: 20, deps: ['le-00'] };
  entries['le-sk'] = { pk: 'LEVEL',   sum: 'Sky',                   pts: 20, deps: ['le-00'] };
  entries['le-st'] = { pk: 'LEVEL',   sum: 'Streams',               pts: 20, deps: ['le-00'] };
  entries['le-ca'] = { pk: 'LEVEL',   sum: 'Caves',                 pts: 20, deps: ['le-00'] };
  entries['le-we'] = { pk: 'LEVEL',   sum: 'Weather Patterns',      pts: 10, deps: ['le-00'] };
  entries['le-co'] = { pk: 'LEVEL',   sum: 'Configuration',         pts: 50, deps: ['le-00','le-sk','le-as','le-we','le-ca','le-st','le-po','le-ri'] };
  entries['le-da'] = { pk: 'UNITY',   sum: 'Discoverable Areas',    pts: 10, deps: ['le-co'] };
  entries['le-li'] = { pk: 'UNITY',   sum: 'Lightmapping',          pts: 10, deps: ['le-co'] };
  entries['le-me'] = { pk: 'UNITY',   sum: 'Metadata',              pts: 20, deps: ['le-da','le-li'] };
  entries['co-in'] = { pk: 'CODE',    sum: 'Integration',           pts: 20, deps: ['le-me'] };
  entries['le-op'] = { pk: 'LEVEL',   sum: 'Optimization',          pts: 10, deps: ['co-in'] };
  entries['qa-00'] = { pk: 'QA',      sum: '',                      pts: 40, deps: ['le-op'] };


  sharedTags.push('Environment');
  sharedTags.push('Level');
}

function getBiome(entries, sharedDeps, sharedTags) {
  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);
  
  entries['ad-ss'] = { pk: 'AUDIO',   sum: 'Soundscape',          pts: 15, deps: ['ga-00'] };
  entries['vf-ps'] = { pk: 'VFX',     sum: 'Particle Systems',    pts: 25, deps: ['u3-00'] };
  entries['u3-li'] = { pk: 'UNITY',   sum: 'Lighting',            pts: 10, deps: ['u3-00','vf-ps'] };
  entries['le-co'] = { pk: 'LEVEL',   sum: 'Configuration',       pts: 50, deps: ['u3-00','u3-li'] };
  entries['ai-00'] = { pk: 'AI',      sum: 'Animal Integration',  pts: 20, deps: ['le-co'] };
  entries['u3-pp'] = { pk: 'UNITY',   sum: 'Post-Processing',     pts: 10, deps: ['le-co'] };
  entries['le-op'] = { pk: 'LEVEL',   sum: 'Optimization',        pts: 10, deps: ['u3-pp'] };
  entries['qa-00'] = { pk: 'QA',      sum: '',                    pts: 40, deps: ['le-op'] };
  
  sharedTags.push('Environment');
  sharedTags.push('Biome');
}

function getProp(entries, sharedDeps, sharedTags) {
  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);

  scalePoints(entries, 2);

  sharedTags.push('Environment');
  sharedTags.push('Prop');
}

function getWeather(entries, sharedDeps, sharedTags) {
  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);

  entries['vf-op'] = { pk: 'VFX',     sum: 'Screen Effects',            pts: 25, deps: ['u3-00'] };
  entries['u3-bi'] = { pk: 'LEVEL',   sum: 'Weather Configuration',   pts: 25, deps: ['vf-op'] };

  sharedTags.push('Environment');
  sharedTags.push('Weather');
}

function getCave(entries, sharedDeps, sharedTags) {
  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);
  
  entries['u3-si'] = { pk: 'UNITY',   sum: 'Lightmapping',      pts: 10, deps: ['u3-00'] };
  entries['u3-si'] = { pk: 'LEVEL',   sum: 'Scene Integration', pts: 20, deps: ['u3-00'] };

  sharedTags.push('Environment');
  sharedTags.push('Cave');
}

function addAnimal(entries) {
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);
  addAnimation(entries);
  addInventory(entries);
  addDetails(entries);
  addHarvesting(entries);
  addGameplay(entries);
}

function addFeathers(entries) {
  entries['te-fe'] = { pk: 'TEXTURE', sum: 'Feathers',            pts: 04, deps: ['te-00'] };
  entries['u3-00'].deps.push('te-fe');
}

function addQuadruped(entries) {
  entries['te-tr'] = { pk: 'TEXTURE', sum: 'Tracks',              pts: 02, deps: [] };  
  entries['3d-rh'] = { pk: '3D',      sum: 'Hide',                pts: 20, deps: ['ca-00','ga-00'] };
  entries['te-rh'] = { pk: 'TEXTURE', sum: 'Rawhide',             pts: 10, deps: [] };
  entries['te-th'] = { pk: 'TEXTURE', sum: 'Tanned Hide',         pts: 10, deps: [] };
  entries['u3-00'].deps.push('te-tr');
  entries['u3-00'].deps.push('3d-rh');
  entries['u3-00'].deps.push('te-rh');
  entries['u3-00'].deps.push('te-th');
}

function getMammal(entries, sharedDeps, sharedTags) {
  addAnimal(entries);
  addAI(entries);
  addHerd(entries);
  addQuadruped(entries);
  addPathfinding(entries);

  sharedTags.push('Fauna');
  sharedTags.push('Mammal');
}

function getBird(entries, sharedDeps, sharedTags) {  
  addAnimal(entries);
  addAI(entries);
  addFeathers(entries);
  addSimplePathfinding(entries);

  sharedTags.push('Fauna');
  sharedTags.push('Bird');
}

function getFish(entries, sharedDeps, sharedTags) {
  addAnimal(entries);
  addAI(entries);
  addHerd(entries);

  sharedTags.push('Fauna');
  sharedTags.push('Fish');
}

function getReptile(entries, sharedDeps, sharedTags) {  
  addAnimal(entries);
  addAI(entries);
  addPathfinding(entries);
  addQuadruped(entries);

  sharedTags.push('Fauna');
  sharedTags.push('Reptile');
}

function getAmphibian(entries, sharedDeps, sharedTags) {  
  addAnimal(entries);
  addAI(entries);
  addPathfinding(entries);
  addQuadruped(entries);

  sharedTags.push('Fauna');
  sharedTags.push('Amphibian');
}

function getTree(entries, sharedDeps, sharedTags) {
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);
  addInventory(entries);
  addDetails(entries);
  addHarvesting(entries);

  entries["ca-00"].points = 10;
  entries["ga-00"].points = 06;

  delete entries['ca-ha'];

  scaleTasks(entries, .5, ['ex','ac','st','se']);

  sharedTags.push('Flora');
  sharedTags.push('Tree');
}

function getPlant(entries, sharedDeps, sharedTags) {  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);
  
  entries["ca-00"].points = 10;
  entries["ga-00"].points = 06;

  scaleTasks(entries, .5, ['ex','ac','st','se']);

  sharedTags.push('Flora');
  sharedTags.push('Plant');
}

function getCrop(entries, sharedDeps, sharedTags) {  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);
  addInventory(entries);
  addDetails(entries);
  addHarvesting(entries);

  entries["ca-00"].points = 10;
  entries["ga-00"].points = 06;

  scaleTasks(entries, .5, ['ex','ac','st','se']);
  
  sharedTags.push('Flora');
  sharedTags.push('Crop');
}

function getFungus(entries, sharedDeps, sharedTags) {  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);
  addInventory(entries);
  addDetails(entries);
  addHarvesting(entries);

  entries["ca-00"].points = 10;
  entries["ga-00"].points = 06;

  delete entries['ca-ha'];

  scaleTasks(entries, .5, ['ex','ac','st','se']);

  sharedTags.push('Flora');
  sharedTags.push('Fungus');
}

function getGrass(entries, sharedDeps, sharedTags) {  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);

  entries["ca-00"].points = 10;
  entries["ga-00"].points = 06;

  scaleTasks(entries, .5, ['ex','ac','st','se']);

  sharedTags.push('Flora');
  sharedTags.push('Grass');
}

function getFood(entries, sharedDeps, sharedTags) {  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);
  addInventory(entries);
  addCrafting(entries);
  addDetails(entries);
  addHarvesting(entries);

  entries["ca-00"].points = 10;
  entries["ga-00"].points = 06;

  sharedTags.push('Food');
}

function getTechnology(entries, sharedDeps, sharedTags) { 
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);
  addAnimation(entries);
  addInventory(entries);
  addCrafting(entries);
  addUpgrades(entries);
  addGameplay(entries);
  addUserInput(entries);
  
  sharedTags.push('Technology');
}

function getItem(entries, sharedDeps, sharedTags) {
  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);
  addInventory(entries);
  addCrafting(entries);

  sharedTags.push('Item');
}

function getCrafting(entries, sharedDeps, sharedTags) {
  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);
  addInventory(entries);
  addCrafting(entries);

  scalePoints(entries, .5);

  sharedTags.push('Crafting');
}

function getRawMaterial(entries, sharedDeps, sharedTags) {
  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);
  addInventory(entries);
  addCrafting(entries);

  scalePoints(entries, .5);

  sharedTags.push('Raw Material');
}

function getWood(entries, sharedDeps, sharedTags) {
  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);
  addInventory(entries);
  addCrafting(entries);

  scalePoints(entries, .5);

  sharedTags.push('Wood');
}

function getCustomization(entries, sharedDeps, sharedTags) {
  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);

  sharedTags.push('Customization');
}


exports.rule = entities.Issue.action({
  title: 'Populate Feature',
  command: 'feature-populate',
  guard: (ctx) => {
    return ctx.issue.fields["Category"].presentation !== "Feature Set";
  },
  action: (ctx) => {    
    
    const category = ctx.issue.fields["Category"].presentation;

    const entries = {};
    const sharedDeps = []
    const sharedTags = [];

    switch(category) {
      case 'Launch':
        getLaunch(entries, sharedDeps, sharedTags);
        break;
      case 'Post Launch':
        getPostLaunch(entries, sharedDeps, sharedTags);
        break;
      case 'Release':
        getRelease(entries, sharedDeps, sharedTags);
        break;
      case 'Post Release':
        getPostRelease(entries, sharedDeps, sharedTags);
        break;
      case 'Promotion':
        getPromotion(entries, sharedDeps, sharedTags);
        break;
      case 'Build':
        getBuild(entries, sharedDeps, sharedTags);
        break;
      case 'Platform':
        getPlatform(entries, sharedDeps, sharedTags);
        break;
      case 'System':
        getSystem(entries, sharedDeps, sharedTags);
        break;
      case 'Administrative':
        getAdministrative(entries, sharedDeps, sharedTags);
        break;
      case 'Culture':
        getCulture(entries, sharedDeps, sharedTags);
        break;
      case 'Language':
        getLanguage(entries, sharedDeps, sharedTags);
        break;
      case 'Screen':
        getScreen(entries, sharedDeps, sharedTags);
        break;
      case 'HUD Overlay':
        getHUD(entries, sharedDeps, sharedTags);
        break;
      case 'World':
        getWorld(entries, sharedDeps, sharedTags);
        break;
      case 'Level':
        getLevel(entries, sharedDeps, sharedTags);
        break;
      case 'Biome':
        getBiome(entries, sharedDeps, sharedTags);
        break;
      case 'Prop':
        getProp(entries, sharedDeps, sharedTags);
        break;
      case 'Mammal':
        getMammal(entries, sharedDeps, sharedTags);
        break;
      case 'Bird':
        getBird(entries, sharedDeps, sharedTags);
        break;
      case 'Fish':
        getFish(entries, sharedDeps, sharedTags);
        break;
      case 'Reptile':
        getReptile(entries, sharedDeps, sharedTags);
        break;      
      case 'Amphibian':
        getAmphibian(entries, sharedDeps, sharedTags);
        break;
      case 'Tree':
        getTree(entries, sharedDeps, sharedTags);
        break;
      case 'Plant':
        getPlant(entries, sharedDeps, sharedTags);
        break;
      case 'Crop':
        getCrop(entries, sharedDeps, sharedTags);
        break;
      case 'Grass':
        getGrass(entries, sharedDeps, sharedTags);
        break;
      case 'Fungus':
        getFungus(entries, sharedDeps, sharedTags);
        break;
      case 'Food':
        getFood(entries, sharedDeps, sharedTags);
        break;
      case 'Technology':
        getTechnology(entries, sharedDeps, sharedTags);
        break;
      case 'Item':
        getItem(entries, sharedDeps, sharedTags);
        break;
      case 'Crafting':
        getCrafting(entries, sharedDeps, sharedTags);
        break;
      case 'Raw Material':
        getRawMaterial(entries, sharedDeps, sharedTags);
        break;
      case 'Wood':
        getWood(entries, sharedDeps, sharedTags);
        break;
      case 'Weather':
        getWeather(entries, sharedDeps, sharedTags);
        break;
      case 'Cave':
        getCave(entries, sharedDeps, sharedTags);
        break;
      case 'Customization':
        getCustomization(entries, sharedDeps, sharedTags);
        break;
      default:
        throw 'Undefined case in feature-populate!';
    }     
    
    validateEntries(entries);

    appalachia.populate.createComplexIssues(
      ctx,
      ctx.issue, 
      entries,
      sharedDeps,
      sharedTags,
      );

  },
  requirements: appalachia.requirements.featureRoadmap
});