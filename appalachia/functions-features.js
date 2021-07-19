function addBuild() {
  entries['pr-re'] = { pk: 'PROD',    sum: 'Release Plan',            pts: 20, deps: [] };
  entries['pr-pr'] = { pk: 'PROD',    sum: 'Production',              pts: 20, deps: ['pr-re'] };
  entries['un-pr'] = { pk: 'UNITY',   sum: 'Promotional Materials',   pts: 10, deps: ['pr-re'] };
  entries['me-pr'] = { pk: 'MEDIA',   sum: 'Promotional Materials',   pts: 10, deps: ['un-pr'] };
  entries['me-so'] = { pk: 'MEDIA',   sum: 'Social Media',            pts: 20, deps: ['me-pr'] };
  entries['me-ad'] = { pk: 'MEDIA',   sum: 'Advertising',             pts: 20, deps: ['me-pr'] };
  entries['da-la'] = { pk: 'DATA',    sum: 'Launch Analytics',        pts: 10, deps: ['pr-re'] };
  entries['qa-tp'] = { pk: 'QA',      sum: 'Test Plan',               pts: 20, deps: ['pr-re'] };
  entries['co-as'] = { pk: 'CODE',    sum: 'Asset Bundling',          pts: 10, deps: ['pr-re'] };
  entries['un-as'] = { pk: 'UNITY',   sum: 'Asset Bundling',          pts: 20, deps: ['co-as'] };
  entries['co-sc'] = { pk: 'CODE',    sum: 'Schema Migration',        pts: 30, deps: ['pr-re'] };
  entries['co-la'] = { pk: 'CONCEPT', sum: 'Launch Symbol',           pts: 10, deps: ['pr-re'] };
  entries['ui-up'] = { pk: 'UI',      sum: 'Update Popup',            pts: 10, deps: ['me-pr','co-la'] };
  entries['te-ab'] = { pk: 'TECH',    sum: 'Application Buildout',    pts: 40, deps: ['ui-up','co-sc','un-as'] };
  entries['qa-tc'] = { pk: 'QA',      sum: 'Test Coordination',       pts: 10, deps: ['qa-tp','te-ab'] };
  entries['qa-pl'] = { pk: 'QA',      sum: 'Playthrough Testing',     pts: 40, deps: ['qa-tc'] };
  entries['qa-re'] = { pk: 'QA',      sum: 'Regression Testing',      pts: 40, deps: ['qa-tc'] };
  entries['qa-sa'] = { pk: 'QA',      sum: 'Saved Game Validation',   pts: 10, deps: ['qa-tc'] };
  entries['pk-ve'] = { pk: 'PKG',     sum: 'Versioning + Packaging',  pts: 30, deps: ['qa-pl','qa-re','qa-sa'] };
  entries['te-ad'] = { pk: 'TECH',    sum: 'Application Delivery',    pts: 20, deps: ['pk-ve'] };
  entries['pr-ma'] = { pk: 'PROD',    sum: 'Marketplace Integration', pts: 10, deps: ['te-ad'] };
  entries['pr-go'] = { pk: 'PROD',    sum: 'Go Live',                 pts: 10, deps: ['pr-ma'] };
  entries['pr-co'] = { pk: 'PROD',    sum: 'Community Management',    pts: 40, deps: ['pr-go'] };
  entries['pr-li'] = { pk: 'PROD',    sum: 'Live Support',            pts: 40, deps: ['pr-go'] };
  entries['pr-ac'] = { pk: 'PROD',    sum: 'Accounting',              pts: 10, deps: ['pr-go'] };
  entries['pr-ro'] = { pk: 'PROD',    sum: 'Royalty Reporting',       pts: 10, deps: ['pr-ac'] };
}


function addBase(entries) {
  
  entries['ca-00'] = { pk: 'CONCEPT', sum: '',                    pts: 10, deps: [] };

  entries['ga-00'] = { pk: 'GAME',    sum: 'Gameplay',            pts: 10, deps: ['ca-00'] };

  entries['ga-sy'] = { pk: 'GAME',    sum: 'Symbols + Glyphs',    pts: 02, deps: ['ga-00'] };    
  entries['ca-sy'] = { pk: 'SYMBOL',  sum: 'Symbols + Glyphs',    pts: 06, deps: ['ga-sy'] };    
  entries['ui-sy'] = { pk: 'UI',      sum: 'Symbols + Glyphs',    pts: 04, deps: ['ca-sy'] };

  entries['u3-00'] = { pk: 'UNITY',   sum: 'Asset Setup',         pts: 04, deps: ['ui-sy'] };

  entries['sy-00'] = { pk: 'CODE',    sum: 'System Integration',  pts: 10, deps: ['ga-00'] };
  entries['sy-md'] = { pk: 'CODE',    sum: 'Metadata',            pts: 06, deps: ['sy-00'] };
  entries['u3-md'] = { pk: 'UNITY',   sum: 'Metadata',            pts: 06, deps: ['u3-00','sy-md'] };

  entries['qa-00'] = { pk: 'QA',      sum: '',                    pts: 02, deps: ['u3-00'] };

  entries['pr-rp'] = { pk: 'PROD',    sum: 'Release Plan',        pts: 04, deps: ['qa-00'] };
  entries['da-an'] = { pk: 'DATA',    sum: 'Analytics',           pts: 04, deps: ['u3-pf'] };
  entries['md-sm'] = { pk: 'MEDIA',   sum: 'Media Shots + Post',  pts: 04, deps: ['u3-pf'] };
}

function addExperience(entries) {
  entries['ga-ex'] = { pk: 'GAME',    sum: 'Experience',          pts: 02, deps: ['ga-00'] };
  entries['sy-ex'] = { pk: 'CODE',    sum: 'Experience',          pts: 06, deps: ['ga-ex','sy-00'] };
  entries['ui-ex'] = { pk: 'UI',      sum: 'Experience',          pts: 04, deps: ['sy-ex','u3-00','u3-md'] };
  entries['u3-ex'] = { pk: 'UNITY',   sum: 'Experience',          pts: 04, deps: ['u3-00','ui-ex'] };
  entries['qa-ex'] = { pk: 'QA',      sum: 'Experience',          pts: 02, deps: ['qa-00'] };
}

function addAchievements(entries) {
  entries['ga-ac'] = { pk: 'GAME',    sum: 'Achievements',        pts: 06, deps: ['ga-00'] };
  entries['sy-ac'] = { pk: 'CODE',    sum: 'Achievements',        pts: 06, deps: ['ga-ac','sy-00'] };
  entries['ui-ac'] = { pk: 'UI',      sum: 'Achievements',        pts: 04, deps: ['sy-ac','u3-00','u3-md'] };
  entries['u3-ac'] = { pk: 'UNITY',   sum: 'Achievements',        pts: 04, deps: ['u3-00','ui-ac'] };
  entries['qa-ac'] = { pk: 'QA',      sum: 'Achievements',        pts: 02, deps: ['qa-00'] };
}

function addStats(entries) {
  entries['ga-st'] = { pk: 'GAME',    sum: 'Stats',               pts: 02, deps: ['ga-00'] };
  entries['sy-st'] = { pk: 'CODE',    sum: 'Stats',               pts: 06, deps: ['ga-st','sy-00'] };
  entries['ui-st'] = { pk: 'UI',      sum: 'Stats',               pts: 04, deps: ['sy-st','u3-00','u3-md'] };
  entries['u3-st'] = { pk: 'UNITY',   sum: 'Stats',               pts: 04, deps: ['u3-00','ui-st'] };
  entries['qa-st'] = { pk: 'QA',      sum: 'Stats',               pts: 02, deps: ['qa-00'] };
}

function addSettings(entries) {
  entries['ga-se'] = { pk: 'GAME',    sum: 'Settings',            pts: 02, deps: ['ga-00'] };
  entries['sy-se'] = { pk: 'CODE',    sum: 'Settings',            pts: 06, deps: ['ga-se','sy-00'] };
  entries['ui-se'] = { pk: 'UI',      sum: 'Settings',            pts: 06, deps: ['sy-se','u3-00','u3-md','vx-se'] };
  entries['u3-se'] = { pk: 'UNITY',   sum: 'Settings',            pts: 06, deps: ['u3-00','ui-se'] };
  entries['qa-se'] = { pk: 'QA',      sum: 'Settings',            pts: 02, deps: ['qa-00'] };
}

function addAsset(entries) {  
  addExperience(entries);
  addAchievements(entries);
  addStats(entries);
  addSettings(entries);

  entries['u3-pf'] = { pk: 'UNITY',   sum: 'Prefab Creation',     pts: 10, deps: ['sy-00','u3-00'] };
}

function addModels(entries) {  

  entries['ca-00'].pts = 20;
  entries['ga-00'].pts = 06;

  entries['3d-00'] = { pk: '3D',      sum: '',                    pts: 20, deps: ['ca-00','ga-00'] };

  entries['te-00'] = { pk: 'TEXTURE', sum: '',                    pts: 20, deps: ['3d-00'] };

  entries['u3-00'] = { pk: 'UNITY',   sum: 'Asset Setup',         pts: 04, deps: ['3d-00','te-00','ui-sy'] };

  entries['vx-00'] = { pk: 'VFX',     sum: 'Shading',             pts: 06, deps: ['u3-00'] };
  entries['vx-ma'] = { pk: 'VFX',     sum: 'Materials',           pts: 06, deps: ['vx-00'] };    

  entries['vx-se'] = { pk: 'VFX',     sum: 'Settings',            pts: 06, deps: ['vx-00','vx-ma','ga-se'] };

  entries['sy-ab'] = { pk: 'CODE',    sum: 'Asset Bundling',      pts: 06, deps: ['u3-pf'] };
  entries['u3-ab'] = { pk: 'UNITY',   sum: 'Asset Bundling',      pts: 06, deps: ['sy-ab'] };

  entries['qa-00'].deps.push('u3-ab');

  entries['re-ac'] = { pk: 'REACT',   sum: 'Authenticity',        pts: 04, deps: ['u3-pf'] };
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

  entries['u3-00'].deps.push('an-ga');
  entries['u3-00'].deps.push('ad-ga');
}

function addUserInput(entries) {  

  entries['ga-ui'] = { pk: 'GAME',    sum: 'User Input',          pts: 04, deps: ['ga-00'] };
  entries['sy-ui'] = { pk: 'CODE',    sum: 'User Input',          pts: 06, deps: ['ga-ui'] };
  entries['ui-ui'] = { pk: 'UI',      sum: 'User Input',          pts: 06, deps: ['ga-ui'] };
  entries['u3-ui'] = { pk: 'UNITY',   sum: 'User Input',          pts: 06, deps: ['sy-ui','ui-ui'] };
  entries['qa-ui'] = { pk: 'QA',      sum: 'User Input',          pts: 02, deps: ['u3-ui','qa-00'] };
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

  entries['u3-00'].deps.push('an-cr');
  entries['u3-00'].deps.push('ad-cr');
  entries['u3-00'].deps.push('an-wt');
  entries['u3-00'].deps.push('ad-wt');
  entries['u3-00'].deps.push('3d-wt');
  entries['u3-00'].deps.push('te-wt');
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

  entries['ga-ai'] = { pk: 'GAME',    sum: 'AI',                  pts: 08, deps: ['ga-00'] };
  entries['sy-ai'] = { pk: 'AI',      sum: 'AI',                  pts: 20, deps: ['ga-ai'] };
  entries['u3-ai'] = { pk: 'UNITY',   sum: 'AI',                  pts: 10, deps: ['sy-ai','u3-md'] };
  entries['qa-ai'] = { pk: 'QA',      sum: 'AI',                  pts: 04, deps: ['u3-ai','qa-00'] };
}

function addFeathers(entries) {
  entries['te-fe'] = { pk: 'TEXTURE', sum: 'Feathers',            pts: 04, deps: ['te-00'] };
}

function addScreen(entries) {

  entries['ca-00'].pts = 20;
  entries['ca-00'].sum = 'UI Concept Art'

  entries['ui-ux'] = { pk: 'UI',      sum: 'UX Research',              pts: 20, deps: [] };
  entries['ui-ia'] = { pk: 'UI',      sum: 'Information Architecture', pts: 10, deps: ['ui-ux'] };
  entries['sy-ba'] = { pk: 'CODE',      sum: 'Backend API',              pts: 10, deps: ['ui-ia'] };
  entries['ui-pr'] = { pk: 'UI',      sum: 'UI Prototype',             pts: 20, deps: ['ca-00','ui-ux','ui-ia'] };
  entries['ui-fr'] = { pk: 'UI',      sum: 'Frontend Implementation',  pts: 20, deps: ['ui-ia','ui-pr','ui-sy'] };
  entries['ui-un'] = { pk: 'UI',      sum: 'Unit Testing',             pts: 10, deps: ['ui-fr'] };
  entries['ui-ap'] = { pk: 'UI',      sum: 'API Integration',          pts: 10, deps: ['ui-fr','sy-ba'] };
  entries['ui-de'] = { pk: 'UI',      sum: 'Developer Testing',        pts: 16, deps: ['ui-ap','ui-un'] };

  entries['qa-00'].pts = 20;
  entries['qa-00'].deps.push('ui-de');
}


function addHUD(entries) {
  
  addScreen(entries);
}

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
      if (k.startsWith("u3-")) {
        entries['u3-pf'].deps.push(k);
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
    const index = v.deps.indexOf(k);

    if (index > -1) {
      console.log(v.deps);
      v.deps.splice(index, 1);
      console.log(v.deps);
    }
  }
}

function getBuild() {
  const entries = {};

  addBuild(entries);

  return entries;
}

function getFlora() {
  
  const entries = {};

  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addAsset(entries);
  addModels(entries);
  //addAnimation(entries);
  addInventory(entries);
  //addCrafting(entries);
  //addUpgrades(entries);
  addHarvesting(entries);
  //addGameplay(entries);
  //addUserInput(entries);
  //addAI(entries);

  return entries;
}

function getGrass() {

  const entries = getFlora();

  entries["ca-00"].points = 10;
  entries["ga-00"].points = 06;

  for (const [k, v] of Object.entries(entries)) {
    if (
      k.endsWith("-ex") ||
      k.endsWith("-ac") ||
      k.endsWith("-st") ||
      k.endsWith("-se")
    ) {
      v.pts /= 2;
    }
  }

  return entries;
}

function getPlant() {
  const entries = getFlora();

  entries["ca-00"].points = 10;
  entries["ga-00"].points = 06;

  for (const [k, v] of Object.entries(entries)) {
    if (
      k.endsWith("-ex") ||
      k.endsWith("-ac") ||
      k.endsWith("-st") ||
      k.endsWith("-se")
    ) {
      v.pts /= 2;
    }
  }

  return entries;
}

function getFungus() {
  const entries = getFlora();

  entries["ca-00"].points = 10;
  entries["ga-00"].points = 06;

  for (const [k, v] of Object.entries(entries)) {
    if (
      k.endsWith("-ex") ||
      k.endsWith("-ac") ||
      k.endsWith("-st") ||
      k.endsWith("-se")
    ) {
      v.pts /= 2;
    }
  }

  return entries;
}

function getCrop() {
  const entries = getFlora();

  entries["ca-00"].points = 10;
  entries["ga-00"].points = 06;

  for (const [k, v] of Object.entries(entries)) {
    if (
      k.endsWith("-ex") ||
      k.endsWith("-ac") ||
      k.endsWith("-st") ||
      k.endsWith("-se")
    ) {
      v.pts /= 2;
    }
  }

  return entries;
}

function getTree() {
  const entries = getFlora();

  entries["ca-00"].points = 10;
  entries["ga-00"].points = 06;

  for (const [k, v] of Object.entries(entries)) {
    if (
      k.endsWith("-ex") ||
      k.endsWith("-ac") ||
      k.endsWith("-st") ||
      k.endsWith("-se")
    ) {
      v.pts /= 2;
    }
  }

  return entries;
}

function getAnimal() {
  const entries = {};

  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addAsset(entries);
  addModels(entries);
  addAnimation(entries);
  addInventory(entries);
  //addCrafting(entries);
  //addUpgrades(entries);
  addHarvesting(entries);
  addGameplay(entries);
  //addUserInput(entries);
  addAI(entries);

  return entries;
}

function getBird() {
  const entries = getAnimal();
  addFeathers(entries);

  return entries;
}

function getMammal() {
  const entries = getAnimal();

  return entries;
}

function getFish() {
  const entries = getAnimal();

  return entries;
}

function getReptile() {
  const entries = getAnimal();

  return entries;
}

function getTechnology() {
  const entries = {};

  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addAsset(entries);
  addModels(entries);
  addAnimation(entries);
  addInventory(entries);
  addCrafting(entries);
  addUpgrades(entries);
  //addHarvesting(entries);
  addGameplay(entries);
  addUserInput(entries);
  //addAI(entries);

  return entries;
}

function getAbility() {
  const entries = {};

  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addAsset(entries);
  //addModels(entries);
  addAnimation(entries);
  //addInventory(entries);
  //addCrafting(entries);
  //addUpgrades(entries);
  //addHarvesting(entries);
  addGameplay(entries);
  addUserInput(entries);
  //addAI(entries);

  return entries;
}

function getScreen() {
  const entries = {};

  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addScreen(entries);
  addUserInput(entries);

  return entries;
}

function getHUD() {
  const entries = {};

  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addHUD(entries);
  addUserInput(entries);

  return entries;
}


module.exports = {
  getGrass: validateEntries(getGrass),
  getPlant: validateEntries(getPlant),
  getCrop: validateEntries(getCrop),
  getTree: validateEntries(getTree),
  getFungus: validateEntries(getFungus),

  getBird: validateEntries(getBird),
  getMammal: validateEntries(getMammal),
  getReptile: validateEntries(getReptile),
  getFish: validateEntries(getFish),

  getTechnology: validateEntries(getTechnology),
  getAbility: validateEntries(getAbility),
  
  getScreen: validateEntries(getScreen),
  getHUD: validateEntries(getHUD),

  getBuild: validateEntries(getBuild),
};
