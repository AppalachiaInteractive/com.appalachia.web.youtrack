const entities = require("@jetbrains/youtrack-scripting-api/entities");
const search = require("@jetbrains/youtrack-scripting-api/search");
const appalachia_entities = require("appalachia/workflow-entities");

function cleanTag(tag) {
  return tag
    .replace("&", "+")
    .replace("(", "")
    .replace(")", "")
    .replace("[", "")
    .replace("]", "")
    .replace(",", "")
    .replace(".", "")
    .trim();
}

function getIssue(ctx, project, queries) {
  for (const query of queries) {
    var matches = search.search(project, query, ctx.currentUser);

    if (matches.isNotEmpty()) {
      return matches.first();
    }    
  }

  return null;
}

function getIssueName(v, parentIssue) {
  return (parentIssue.summary + " " + v.sum).trim();
}

function updateIssue(ctx, existing, v, parentIssue, tag, project, user, owner, watchers) { 
  
  parentIssue.links["parent for"].add(existing);

  existing.summary = getIssueName(v, parentIssue);
  existing.project = project;
  existing.fields["Target Release"] = parentIssue.fields["Target Release"];

  existing.addTag(tag);
  existing.addTag("Auto-Generated");

  const tag2 = cleanTag(v.sum);

  if (tag2 !== "") {
    existing.addTag(tag2);
  }

  // contract protected fields
  if (existing.fields["State"].name == "Not Ready" || existing.fields["State"].name == "Open")
  {
    existing.fields.Assignee = user;
    existing.fields.Points = v.pts;
    existing.fields.Owner = owner;
    existing.fields["Deliverable"] = v.dev;
  }  

  for (const watcher of watchers) {
    watcher.watchIssue(existing); 
  }
}

function updateLinks(issues, entries) {
  for (const [k, issue] of Object.entries(issues)) {
    entry = entries[k];

    entry.deps.forEach((dk) => {
      const dependency = issues[dk];

      if (dependency !== null && dependency !== undefined) {
        issue.links["depends on"].add(dependency);
      }
    });
  }
}

function updateSharedDeps(issues, parentIssue, sharedDepsIds) {
  sharedDepsIds.forEach((id) => {
    const sharedDep = entities.Issue.findById(id);
    parentIssue.links["depends on"].add(sharedDep);
  });
}

function updateSharedTags(issues, parentIssue, sharedTags) {
  for (const [k, issue] of Object.entries(issues)) {
    sharedTags.forEach((tag) => {
      issue.addTag(tag);
    });
  }
  sharedTags.forEach((tag) => {
    parentIssue.addTag(tag);
  });
}

function createComplexIssues(
  ctx,
  parentIssue,
  entries,
  sharedDeps,
  sharedTags
) {
  
  const parentSummary = parentIssue.summary;
  const tag = cleanTag(parentSummary);
  parentIssue.addTag(tag);

  const issues = {};

  for (const [k, v] of Object.entries(entries)) {
    var project = entities.Project.findByKey(v.pk);
    var userName = appalachia_entities.assignees[v.pk];
    var user = entities.User.findByLogin(userName);
    var watchers = [ entities.User.findByLogin(appalachia_entities.users.chris) ];
    var owner = appalachia_entities.owners[userName];
    var issueName = getIssueName(v, parentIssue);

    qpr = "project: {" + project.name + "}";
    qpa = "summary: '" + issueName + "'";
    //qsa = "State: {Not Ready},Open,{In Progress}";
    qst = "Subtask of: " + parentIssue.id;
    qde = "Is required for: " + parentIssue.id;
    //qvs = "'"  "'";

    and = ' and ';

    queries = [];

    //if (v.sum == '' ) {
      queries.push(qpr + and + qpa/* + and + qsa*/ + and + qst);
      queries.push(qpr + and + qpa/* + and + qsa*/ + and + qde);
    //}
    //else{
    //  queries.push(qpr + and + qpa/* + and + qsa*/ /*+ and + qvs*/ + and + qst);
    //  queries.push(qpr + and + qpa/* + and + qsa*/ /*+ and + qvs*/ + and + qde);
    //  queries.push(qpr + and + qpa/* + and + qsa*/ /*+ and + qvs*/);
    //}
    
    var existing = getIssue(ctx, project, queries);

    if (existing == null) {      
      existing = new entities.Issue(ctx.currentUser, project, parentIssue.summary + " " + v.sum);
    }

    issues[k] = existing;

    try {
      updateIssue(ctx, existing, v, parentIssue, tag, project, user, owner, watchers);
    } catch (error) {

      console.error(error + ": " + JSON.stringify(v));
      throw error;
    }

  }

  updateLinks(issues, entries);
  updateSharedDeps(issues, parentIssue, sharedDeps);
  updateSharedTags(issues, parentIssue, sharedTags);
}

function validateEntries(entries) {
  for (const [k, v] of Object.entries(entries)) {
    v.pts = Math.round(v.pts);

    if (v.pts < .1) {
      v.pts = .1;
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
      if (k.startsWith("u3") && (!(k.endsWith("-ab")))) {
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
    entry.pts = Math.round(entry.pts * scale);
    entries[key] = entry;
  }
}

function scaleTasks(entries, scale, postFixes) {
  for (const [key, entry] of Object.entries(entries)) {
    for (const postFix of postFixes) {
      if (key.endsWith("-" + postFix)) {
        entry.pts = Math.round(entry.pts * scale);
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
        entry.pts = Math.round(entry.pts * scale);
        entries[key] = entry;
        break;
      }
    }
  }
}

function addBase(entries) {  
  entries['ca-00'] = { pk: 'CONCEPT', sum: 'Concept',             pts: 2.0, dev: "Illustration", deps: [] };

  entries['ga-00'] = { pk: 'GAME',    sum: 'Feature Design',      pts: 0.5, dev: "Design Document", deps: ['ca-00'] };

  entries['ga-sy'] = { pk: 'GAME',    sum: 'Symbols + Glyphs',    pts: 0.3, dev: "Examples", deps: ['ga-00'] };    
  entries['ca-sy'] = { pk: 'SYMBOL',  sum: 'Symbols + Glyphs',    pts: 1.0, dev: "Illustration", deps: ['ga-sy'] };    
  entries['ui-sy'] = { pk: 'UI',      sum: 'Symbols + Glyphs',    pts: 0.3, dev: "SVG Graphics", deps: ['ca-sy'] };

  entries['u3-00'] = { pk: 'ASSET',   sum: 'Asset Setup',         pts: 0.3, dev: "Unity3D Prefab", deps: ['ui-sy'] };

  entries['sy-00'] = { pk: 'CODE',    sum: 'System Integration',  pts: 0.3, dev: "System Code", deps: ['ga-00'] };
  entries['sy-md'] = { pk: 'CODE',    sum: 'Metadata',            pts: 0.3, dev: "ScriptableObject", deps: ['sy-00'] };
  entries['u3-md'] = { pk: 'UNITY',   sum: 'Metadata',            pts: 0.3, dev: "Unity3D Metadata or Component", deps: ['u3-00','sy-md'] };

  entries['qa-00'] = { pk: 'QA',      sum: 'Validation',          pts: 0.3, dev: "QA Screenshots", deps: ['u3-00'] };

  entries['pr-rp'] = { pk: 'PROD',    sum: 'Release Plan',        pts: 0.3, dev: "Planning Document", deps: ['qa-00'] };
  entries['da-an'] = { pk: 'DATA',    sum: 'Analytics',           pts: 0.3, dev: "Analytics Integration", deps: ['u3-pf'] };
  entries['md-sm'] = { pk: 'MEDIA',   sum: 'Media Shots + Post',  pts: 0.3, dev: "Result Analysis", deps: ['u3-pf'] };
}

function addExperience(entries) {
  entries['ga-ex'] = { pk: 'GAME',    sum: 'Experience',          pts: 0.3, dev: "Design Update", deps: ['ga-00'] };
  entries['sy-ex'] = { pk: 'CODE',    sum: 'Experience',          pts: 0.3, dev: "System Code", deps: ['ga-ex','sy-00'] };
  entries['ui-ex'] = { pk: 'UI',      sum: 'Experience',          pts: 0.3, dev: "UI Update", deps: ['sy-ex','u3-00','u3-md'] };
  entries['u3-ex'] = { pk: 'UNITY',   sum: 'Experience',          pts: 0.3, dev: "Unity3D Metadata or Component", deps: ['u3-00','ui-ex'] };
  entries['qa-ex'] = { pk: 'QA',      sum: 'Experience',          pts: 0.1, dev: "QA Screenshots", deps: ['qa-00'] };
}

function addAchievements(entries) {
  entries['ga-ac'] = { pk: 'GAME',    sum: 'Achievements',        pts: 0.3, dev: "Design Update", deps: ['ga-00'] };
  entries['sy-ac'] = { pk: 'CODE',    sum: 'Achievements',        pts: 0.3, dev: "System Code", deps: ['ga-ac','sy-00'] };
  entries['ui-ac'] = { pk: 'UI',      sum: 'Achievements',        pts: 0.3, dev: "UI Update", deps: ['sy-ac','u3-00','u3-md'] };
  entries['u3-ac'] = { pk: 'UNITY',   sum: 'Achievements',        pts: 0.3, dev: "Unity3D Metadata or Component", deps: ['u3-00','ui-ac'] };
  entries['qa-ac'] = { pk: 'QA',      sum: 'Achievements',        pts: 0.1, dev: "QA Screenshots", deps: ['qa-00'] };
}

function addStats(entries) {
  entries['ga-st'] = { pk: 'GAME',    sum: 'Stats',               pts: 0.3, dev: "Design Update", deps: ['ga-00'] };
  entries['sy-st'] = { pk: 'CODE',    sum: 'Stats',               pts: 0.3, dev: "System Code", deps: ['ga-st','sy-00'] };
  entries['ui-st'] = { pk: 'UI',      sum: 'Stats',               pts: 0.3, dev: "UI Update", deps: ['sy-st','u3-00','u3-md'] };
  entries['u3-st'] = { pk: 'UNITY',   sum: 'Stats',               pts: 0.3, dev: "Unity3D Metadata or Component", deps: ['u3-00','ui-st'] };
  entries['qa-st'] = { pk: 'QA',      sum: 'Stats',               pts: 0.1, dev: "QA Screenshots", deps: ['qa-00'] };
}

function addSettings(entries) {
  entries['ga-se'] = { pk: 'GAME',    sum: 'Settings',            pts: 0.3, dev: "Design Update", deps: ['ga-00'] };
  entries['sy-se'] = { pk: 'CODE',    sum: 'Settings',            pts: 0.3, dev: "System Code", deps: ['ga-se','sy-00'] };
  entries['ui-se'] = { pk: 'UI',      sum: 'Settings',            pts: 0.3, dev: "UI Update", deps: ['sy-se','u3-00','u3-md','vx-se'] };
  entries['u3-se'] = { pk: 'UNITY',   sum: 'Settings',            pts: 0.3, dev: "Unity3D Metadata or Component", deps: ['u3-00','ui-se'] };
  entries['qa-se'] = { pk: 'QA',      sum: 'Settings',            pts: 0.1, dev: "QA Screenshots", deps: ['qa-00'] };
}

function addPrefab(entries) {  

  entries['u3-pf'] = { pk: 'UNITY',   sum: 'Prefab Creation',     pts: 0.3, dev: "Unity3D Prefab", deps: ['u3-00'] };
}

function addModels(entries) {  

  entries['ca-00'].pts *= 2.0;
  entries['ga-00'].pts *= 2.0;

  entries['3d-00'] = { pk: '3D',      sum: 'Modeling',            pts: 1.0, dev: "FBX 3D Model", deps: ['ca-00','ga-00'] };

  entries['te-00'] = { pk: 'TEXTURE', sum: 'Texturing',           pts: 1.0, dev: "PBR Texture Set", deps: ['3d-00'] };

  entries['u3-00'] = { pk: 'ASSET',   sum: 'Asset Setup',         pts: 0.3, dev: "Unity3D Prefab", deps: ['3d-00','te-00','ui-sy'] };

  entries['vx-00'] = { pk: 'VFX',     sum: 'Shading',             pts: 0.3, dev: "Unity3D Shader Updates", deps: ['u3-00'] };
  entries['vx-ma'] = { pk: 'VFX',     sum: 'Materials',           pts: 0.3, dev: "Unity3D Material", deps: ['vx-00'] };    

  entries['vx-se'] = { pk: 'VFX',     sum: 'Settings',            pts: 0.3, dev: "Unity3D Quality Setting", deps: ['vx-00','vx-ma','ga-se'] };

  entries['sy-ab'] = { pk: 'CODE',    sum: 'Asset Bundling',      pts: 0.3, dev: "LoadAsset Code Updates", deps: ['u3-pf'] };
  entries['u3-ab'] = { pk: 'ASSET',   sum: 'Asset Bundling',      pts: 0.3, dev: "Unity3D Asset Bundle", deps: ['sy-ab'] };

}

function addAnimation(entries) {  

  entries['ga-an'] = { pk: 'GAME',    sum: 'Animation',           pts: 0.3, dev: "Requirement List", deps: ['ga-00'] };
  entries['an-rg'] = { pk: 'ANIM',    sum: 'Rigging',             pts: 1.0, dev: "Blender Rigify Rig", deps: ['ga-an'] };
  entries['an-an'] = { pk: 'ANIM',    sum: 'Animation',           pts: 1.0, dev: "FBX Animation", deps: ['an-rg'] };
  entries['ad-an'] = { pk: 'AUDIO',   sum: 'Animation',           pts: 0.5, dev: "WAV File", deps: ['an-an'] };
  entries['u3-an'] = { pk: 'UNITY',   sum: 'Animation',           pts: 1.0, dev: "Unity3D State Machine", deps: ['an-an','ad-an'] };
  entries['sy-an'] = { pk: 'CODE',    sum: 'Animation',           pts: 0.5, dev: "MonoBehaviour", deps: ['u3-an'] };
  entries['qa-an'] = { pk: 'QA',      sum: 'Animation',           pts: 0.3, dev: "QA Screenshots", deps: ['u3-pf','sy-an'] };
}

function addGameplay(entries) {

  entries['ga-vx'] = { pk: 'GAME',    sum: 'VFX',                 pts: 0.5, dev: "Examples", deps: ['ga-00'] };

  entries['an-ga'] = { pk: 'ANIM',    sum: 'Gameplay',            pts: 1.0, dev: "FBX Animation", deps: ['ga-00','an-rg','3d-00'] };

  entries['ad-ga'] = { pk: 'AUDIO',   sum: 'Gameplay',            pts: 1.0, dev: "WAV File", deps: ['ga-00','an-ga'] };

  entries['sy-ph'] = { pk: 'CODE',    sum: 'Physics',             pts: 2.0, dev: "Burst Simulation", deps: ['ga-00'] };
  entries['sy-ga'] = { pk: 'CODE',    sum: 'Gameplay',            pts: 2.0, dev: "System Code", deps: ['sy-00','sy-ph','ga-00'] };

  entries['ui-ga'] = { pk: 'UI',      sum: 'Gameplay',            pts: 2.0, dev: "UI Update", deps: ['ga-ga','sy-00','u3-00','u3-md'] };

  entries['ui-hd'] = { pk: 'UI',      sum: 'HUD Overlay',         pts: 2.0, dev: "UI Update", deps: ['sy-ph','sy-ui','sy-fi','ga-hd','sy-hd','u3-00','u3-md'] };
  entries['vx-vx'] = { pk: 'VFX',     sum: 'VFX',                 pts: 0.5, dev: "Unity3D VFX", deps: ['ga-vx', 'u3-00'] };

  entries['u3-ga'] = { pk: 'UNITY',   sum: 'Gameplay',            pts: 0.5, dev: "Unity3D Metadata or Component", deps: ['sy-00','ui-ga','vx-vx','ui-hd'] };
  entries['qa-ga'] = { pk: 'QA',      sum: 'Gameplay',            pts: 0.3, dev: "QA Screenshots", deps: ['qa-00','u3-ab','ui-ga','u3-ga','u3-pf'] };
}

function addUserInput(entries) {  
  entries['ga-ui'] = { pk: 'GAME',    sum: 'User Input',          pts: 0.5, dev: "Design Update", deps: ['ga-00'] };
  entries['ac-ui'] = { pk: 'ACCESS',  sum: 'User Input',          pts: 0.5, dev: "Design Update", deps: ['ga-ui'] };
  entries['sy-ui'] = { pk: 'CODE',    sum: 'User Input',          pts: 0.5, dev: "System Code", deps: ['ga-ui'] };
  entries['ui-ui'] = { pk: 'UI',      sum: 'User Input',          pts: 0.5, dev: "UI Update", deps: ['ga-ui'] };
  entries['u3-ui'] = { pk: 'UNITY',   sum: 'User Input',          pts: 0.5, dev: "Unity3D Metadata or Component", deps: ['ac-ui','sy-ui','ui-ui'] };
  entries['qa-ui'] = { pk: 'QA',      sum: 'User Input',          pts: 0.2, dev: "QA Screenshots", deps: ['u3-ui','qa-00'] };
}

function addDetails(entries) {  
  entries['ga-dt'] = { pk: 'GAME',    sum: 'Details',           pts: 0.3, dev: "Design Update", deps: ['ga-00'] };
  entries['sy-dt'] = { pk: 'CODE',    sum: 'Details',           pts: 0.3, dev: "System Code", deps: ['ga-dt'] };
  entries['ui-dt'] = { pk: 'UI',      sum: 'Details',           pts: 0.3, dev: "UI Update", deps: ['sy-dt','u3-00'] };
  entries['u3-dt'] = { pk: 'UNITY',   sum: 'Details',           pts: 0.3, dev: "Unity3D Metadata or Component", deps: ['ui-dt','u3-md'] };
  entries['qa-dt'] = { pk: 'QA',      sum: 'Details',           pts: 0.1, dev: "QA Screenshots", deps: ['u3-dt','qa-00'] };
}

function addInventory(entries) {  
  entries['ga-in'] = { pk: 'GAME',    sum: 'Inventory',           pts: 0.3, dev: "Design Update", deps: ['ga-00'] };
  entries['sy-in'] = { pk: 'CODE',    sum: 'Inventory',           pts: 0.3, dev: "System Code", deps: ['ga-in'] };
  entries['ui-in'] = { pk: 'UI',      sum: 'Inventory',           pts: 0.3, dev: "UI Update", deps: ['sy-in','u3-00'] };
  entries['u3-in'] = { pk: 'UNITY',   sum: 'Inventory',           pts: 0.3, dev: "Unity3D Metadata or Component", deps: ['ui-in','u3-md'] };
  entries['qa-in'] = { pk: 'QA',      sum: 'Inventory',           pts: 0.1, dev: "QA Screenshots", deps: ['u3-in','qa-00'] };
}

function addCrafting(entries) { 
  entries['ca-00'].pts += 0.6;
  entries['ga-cr'] = { pk: 'GAME',    sum: 'Crafting',            pts: 0.3, dev: "Design Update", deps: ['ca-00','ga-in'] };
  entries['an-cr'] = { pk: 'ANIM',    sum: 'Crafting',            pts: 0.3, dev: "FBX Animation", deps: ['ga-cr','an-rg','3d-00','3d-up','3d-wt'] };
  entries['ad-cr'] = { pk: 'AUDIO',   sum: 'Crafting',            pts: 0.3, dev: "WAV File", deps: ['ga-cr','an-cr'] };
  entries['sy-cr'] = { pk: 'CODE',    sum: 'Crafting',            pts: 0.3, dev: "System Code", deps: ['ga-cr','sy-00'] };
  entries['ui-cr'] = { pk: 'UI',      sum: 'Crafting',            pts: 0.3, dev: "UI Update", deps: ['sy-cr','u3-00','u3-md'] };
  entries['u3-cr'] = { pk: 'UNITY',   sum: 'Crafting',            pts: 0.3, dev: "Unity3D Metadata or Component", deps: ['sy-cr','ui-cr'] };
  entries['qa-cr'] = { pk: 'QA',      sum: 'Crafting',            pts: 0.1, dev: "QA Screenshots", deps: ['u3-cr','qa-00'] };

  entries['ga-wt'] = { pk: 'GAME',    sum: 'Wear + Tear',         pts: 0.3, dev: "Design Update", deps: ['ga-cr',,'ga-in'] };
  entries['an-wt'] = { pk: 'ANIM',    sum: 'Wear + Tear',         pts: 0.3, dev: "FBX Animation", deps: ['an-cr','ga-wt','an-rg','3d-00','3d-up','3d-wt'] };
  entries['3d-wt'] = { pk: '3D',      sum: 'Wear + Tear',         pts: 0.3, dev: "FBX 3D Model", deps: ['ca-00','ga-wt'] };
  entries['te-wt'] = { pk: 'TEXTURE', sum: 'Wear + Tear',         pts: 0.3, dev: "PBR Texture Set", deps: ['3d-00'] };
  entries['ad-wt'] = { pk: 'AUDIO',   sum: 'Wear + Tear',         pts: 0.3, dev: "WAV File", deps: ['ad-cr','ga-wt','an-wt'] };
  entries['sy-wt'] = { pk: 'CODE',    sum: 'Wear + Tear',         pts: 0.3, dev: "System Code", deps: ['sy-cr','ga-wt','sy-00'] };
  entries['ui-wt'] = { pk: 'UI',      sum: 'Wear + Tear',         pts: 0.3, dev: "UI Update", deps: ['ui-cr','sy-wt','u3-00','u3-md'] };
  entries['u3-wt'] = { pk: 'UNITY',   sum: 'Wear + Tear',         pts: 0.3, dev: "Unity3D Metadata or Component", deps: ['u3-cr','sy-wt','ui-wt'] };
  entries['qa-wt'] = { pk: 'QA',      sum: 'Wear + Tear',         pts: 0.1, dev: "QA Screenshots", deps: ['qa-cr','u3-wt','qa-00'] };
}

function addUpgrades(entries) {  
  entries['ca-00'].pts += 0.6;
  entries['ga-up'] = { pk: 'GAME',    sum: 'Upgrades',            pts: 0.3, dev: "Design Update", deps: ['ca-00','ga-cr'] };
  entries['3d-up'] = { pk: '3D',      sum: 'Upgrades',            pts: 0.3, dev: "FBX 3D Model", deps: ['ca-00','ga-up','3d-00'] };
  entries['te-up'] = { pk: 'TEXTURE', sum: 'Upgrades',            pts: 0.3, dev: "PBR Texture Set", deps: ['3d-up','te-00'] };
  entries['sy-up'] = { pk: 'CODE',    sum: 'Upgrades',            pts: 0.3, dev: "System Code", deps: ['ga-up'] };
  entries['ui-up'] = { pk: 'UI',      sum: 'Upgrades',            pts: 0.3, dev: "UI Update", deps: ['sy-up','u3-00','u3-md'] };
  entries['u3-up'] = { pk: 'UNITY',   sum: 'Upgrades',            pts: 0.3, dev: "Unity3D Metadata or Component", deps: ['sy-up','ui-up'] };
  entries['qa-up'] = { pk: 'QA',      sum: 'Upgrades',            pts: 0.1, dev: "QA Screenshots", deps: ['u3-up','qa-00'] };
}

function addHarvesting(entries) {
  entries['ca-00'].pts += 0.6;
  entries['ga-ha'] = { pk: 'GAME',    sum: 'Harvesting',          pts: 0.3, dev: "Design Update", deps: ['ca-00','ga-in'] };
  entries['3d-ha'] = { pk: '3D',      sum: 'Harvesting',          pts: 0.3, dev: "FBX 3D Model", deps: ['ca-00','ga-ha','3d-00'] };
  entries['sy-ha'] = { pk: 'CODE',    sum: 'Harvesting',          pts: 0.3, dev: "System Code", deps: ['ga-ha'] };
  entries['ui-ha'] = { pk: 'UI',      sum: 'Harvesting',          pts: 0.3, dev: "UI Update", deps: ['sy-ha','u3-00','u3-md'] };
  entries['u3-ha'] = { pk: 'UNITY',   sum: 'Harvesting',          pts: 0.3, dev: "Unity3D Metadata or Component", deps: ['3d-ha','sy-ha','ui-ha'] };
  entries['qa-ha'] = { pk: 'QA',      sum: 'Harvesting',          pts: 0.1, dev: "QA Screenshots", deps: ['u3-ha','qa-00'] };
}

function addFoodPreparation(entries) {
  entries['ca-00'].pts += 0.6;
  entries['ga-fp'] = { pk: 'GAME',    sum: 'Food Preparation',    pts: 0.3, dev: "Design Update", deps: ['ca-00','ga-in'] };
  entries['3d-fp'] = { pk: '3D',      sum: 'Food Preparation',    pts: 0.3, dev: "FBX 3D Model", deps: ['ca-00','ga-fp','3d-00'] };
  entries['sy-fp'] = { pk: 'CODE',    sum: 'Food Preparation',    pts: 0.3, dev: "System Code", deps: ['ga-fp'] };
  entries['ui-fp'] = { pk: 'UI',      sum: 'Food Preparation',    pts: 0.3, dev: "UI Update", deps: ['sy-fp','u3-00','u3-md'] };
  entries['u3-fp'] = { pk: 'UNITY',   sum: 'Food Preparation',    pts: 0.3, dev: "Unity3D Metadata or Component", deps: ['3d-fp','sy-fp','ui-fp'] };
  entries['qa-fp'] = { pk: 'QA',      sum: 'Food Preparation',    pts: 0.1, dev: "QA Screenshots", deps: ['u3-fp','qa-00'] };
}

function addAI(entries) {
  entries['ai-ai'] = { pk: 'AI',      sum: 'AI',                  pts: 1.0, dev: "AI Graph", deps: [] };
  entries['u3-ai'] = { pk: 'UNITY',   sum: 'AI',                  pts: 0.5, dev: "Unity3D Metadata or Component", deps: ['ai-ai','u3-md'] };
  entries['qa-ai'] = { pk: 'QA',      sum: 'AI',                  pts: 0.3, dev: "QA Screenshots", deps: ['u3-ai','qa-00'] };
}

function addHerd(entries) {
  entries['ai-he'] = { pk: 'AI',      sum: 'Herd Behavior',         pts: 1.0, dev: "AI Graph", deps: ['ai-ai'] };
  entries['u3-he'] = { pk: 'UNITY',   sum: 'Herd Behavior',         pts: 0.5, dev: "Unity3D Metadata or Component", deps: ['u3-ai','ai-he','u3-md'] };
  entries['qa-he'] = { pk: 'QA',      sum: 'Herd Behavior',         pts: 0.3, dev: "QA Screenshots", deps: ['qa-ai','u3-he','qa-00'] };
}

function addSimplePathfinding(entries) {
  entries['ai-st'] = { pk: 'AI',      sum: 'Pathfinding',         pts: 1.0, dev: "ASTAR Update", deps: ['ai-ai'] };
  entries['u3-st'] = { pk: 'UNITY',   sum: 'Pathfinding',         pts: 0.5, dev: "Unity3D Metadata or Component", deps: ['u3-ai','ai-st','u3-md'] };
  entries['qa-st'] = { pk: 'QA',      sum: 'Pathfinding',         pts: 0.3, dev: "QA Screenshots", deps: ['qa-ai','u3-st','qa-00'] };
}

function addPathfinding(entries) {
  entries['ai-pt'] = { pk: 'AI',      sum: 'Pathfinding',         pts: 1.0, dev: "ASTAR Update", deps: ['ai-ai',] };
  entries['u3-pt'] = { pk: 'UNITY',   sum: 'Pathfinding',         pts: 0.5, dev: "Unity3D Metadata or Component", deps: ['u3-ai','ai-pt','u3-md'] };
  entries['qa-pt'] = { pk: 'QA',      sum: 'Pathfinding',         pts: 0.3, dev: "QA Screenshots", deps: ['qa-ai','u3-pt','qa-00'] };
}

function getPromotion(entries, sharedDeps, sharedTags) {
  
  entries['pr-re'] = { pk: 'PROD',    sum: 'Promotional Plan',        pts: 8.0, dev: "Strategy Document", deps: [] };
  entries['un-pr'] = { pk: 'UNITY',   sum: 'Promotional Materials',   pts: 8.0, dev: "Promo Assets", deps: ['pr-re'] };
  entries['me-so'] = { pk: 'MEDIA',   sum: 'Social Media',            pts: 8.0, dev: "Result Analysis", deps: ['pr-re'] };
  entries['me-po'] = { pk: 'MEDIA',   sum: 'Promotions',              pts: 8.0, dev: "Result Analysis", deps: ['pr-re'] };
  entries['me-br'] = { pk: 'MEDIA',   sum: 'Brand Management',        pts: 8.0, dev: "Result Analysis", deps: ['pr-re'] };
  entries['me-di'] = { pk: 'MEDIA',   sum: 'Digital Influence',       pts: 8.0, dev: "Result Analysis", deps: ['pr-re'] };
  entries['me-pb'] = { pk: 'MEDIA',   sum: 'Public Relations',        pts: 8.0, dev: "Result Analysis", deps: ['pr-re'] };
  entries['me-ad'] = { pk: 'MEDIA',   sum: 'Advertising',             pts: 8.0, dev: "Result Analysis", deps: ['pr-re'] };
  entries['da-la'] = { pk: 'DATA',    sum: 'Analytics',               pts: 8.0, dev: "Analytics Report", deps: ['pr-re'] };
  entries['pr-co'] = { pk: 'LIVE',    sum: 'Community Management',    pts: 8.0, deps: ['pr-re'] };
  entries['pr-pr'] = { pk: 'PROD',    sum: 'Production',              pts: 8.0, deps: ['pr-re','un-pr','me-so','me-po','me-br','me-di','me-pb','me-ad','da-la','pr-co'] };

  
  sharedTags.push("Promotion");
}

function getBuild(entries, sharedDeps, sharedTags) {
  entries['pr-re'] = { pk: 'PROD',    sum: 'Feature List',            pts: 8.0, dev: "Requirement List", deps: [] };
  entries['bu-re'] = { pk: 'BUILD',   sum: 'Build Plan',              pts: 16.0, dev: "Infrastructure", deps: ['pr-re'] };
  entries['qa-tp'] = { pk: 'QA',      sum: 'Test Plan',               pts: 8.0, dev: "QA Test Plan", deps: ['pr-re'] };
  entries['co-as'] = { pk: 'CODE',    sum: 'Asset Bundling',          pts: 16.0, dev: "LoadAsset Code Updates", deps: ['pr-re'] };
  entries['un-as'] = { pk: 'ASSET',   sum: 'Asset Bundling',          pts: 16.0, dev: "Unity3D Asset Bundle", deps: ['co-as'] };
  entries['co-sc'] = { pk: 'CODE',    sum: 'Schema Migration',        pts: 8.0, dev: "Schema Migration", deps: ['bu-re'] };
  entries['co-la'] = { pk: 'SYMBOL',  sum: 'Promotional Symbol',      pts: 8.0, dev: "Illustration", deps: ['pr-re'] };
  entries['ui-up'] = { pk: 'UI',      sum: 'Update Popup',            pts: 8.0, dev: "Update Popup", deps: ['bu-re','co-la'] };
  entries['bu-bp'] = { pk: 'BUILD',   sum: 'Build Pipeline',          pts: 16.0, dev: "Infrastructure", deps: ['bu-re','qa-tp','un-as'] };
  entries['bu-ab'] = { pk: 'BUILD',   sum: 'Application Buildout',    pts: 8.0, dev: "Compiled Software", deps: ['ui-up','co-sc','bu-bp'] };
  entries['tc-ba'] = { pk: 'TECH',    sum: 'Data Backups',            pts: 8.0, dev: "Infrastructure", deps: ['bu-ab'] };
  entries['qa-pl'] = { pk: 'QA',      sum: 'Playthrough',             pts: 8.0, dev: "QA Screenshots", deps: ['qa-tp','bu-ab'] };
  entries['qa-re'] = { pk: 'QA',      sum: 'Regression',              pts: 8.0, dev: "QA Screenshots", deps: ['qa-tp','bu-ab'] };
  entries['qa-sa'] = { pk: 'QA',      sum: 'Saved Game Validation',   pts: 4.0, dev: "QA Screenshots", deps: ['qa-tp','bu-ab'] };

  sharedTags.push("Build");
}

function getRelease(entries, sharedDeps, sharedTags) {  
  
  entries['pr-re'] = { pk: 'PROD',    sum: 'Release Plan',            pts: 8.0, dev: "Planning Document", deps: [] };
  entries['un-pr'] = { pk: 'UNITY',   sum: 'Promotional Materials',   pts: 8.0, dev: "Promo Assets", deps: ['pr-re'] };
  entries['me-so'] = { pk: 'MEDIA',   sum: 'Social Media',            pts: 4.0, dev: "Result Analysis", deps: ['un-pr'] };
  entries['me-po'] = { pk: 'MEDIA',   sum: 'Promotions',              pts: 4.0, dev: "Result Analysis", deps: ['un-pr'] };
  entries['me-br'] = { pk: 'MEDIA',   sum: 'Brand Management',        pts: 4.0, dev: "Result Analysis", deps: ['un-pr'] };
  entries['me-di'] = { pk: 'MEDIA',   sum: 'Digital Influence',       pts: 4.0, dev: "Result Analysis", deps: ['un-pr'] };
  entries['me-pb'] = { pk: 'MEDIA',   sum: 'Public Relations',        pts: 4.0, dev: "Result Analysis", deps: ['un-pr'] };
  entries['me-ad'] = { pk: 'MEDIA',   sum: 'Advertising',             pts: 4.0, dev: "Result Analysis", deps: ['un-pr'] };
  entries['da-la'] = { pk: 'DATA',    sum: 'Analytics',               pts: 8.0, dev: "Analytics Report", deps: ['pr-re'] };
  entries['pk-ve'] = { pk: 'PKG',     sum: 'Versioning + Packaging',  pts: 8.0, dev: "Compiled Software", deps: ['pr-re'] };
  entries['tc-ad'] = { pk: 'TECH',    sum: 'Application Delivery',    pts: 8.0, deps: ['pk-ve'] };
  entries['pr-ma'] = { pk: 'PROD',    sum: 'Marketplace Integration', pts: 4.0, deps: ['tc-ad'] };
  entries['pr-pr'] = { pk: 'PROD',    sum: 'Production',              pts: 16.0, deps: ['pr-re','pr-ma'] };
  entries['pr-go'] = { pk: 'LIVE',    sum: 'Go Live',                 pts: 8.0, deps: ['pr-pr'] };
  
  sharedTags.push("Release");
}

function getPostRelease(entries, sharedDeps, sharedTags) {  
  entries['me-so'] = { pk: 'MEDIA',   sum: 'Social Media',            pts: 4.0, dev: "Result Analysis", deps: [] };
  entries['me-po'] = { pk: 'MEDIA',   sum: 'Promotions',              pts: 4.0, dev: "Result Analysis", deps: [] };
  entries['me-br'] = { pk: 'MEDIA',   sum: 'Brand Management',        pts: 4.0, dev: "Result Analysis", deps: [] };
  entries['me-di'] = { pk: 'MEDIA',   sum: 'Digital Influence',       pts: 4.0, dev: "Result Analysis", deps: [] };
  entries['me-pb'] = { pk: 'MEDIA',   sum: 'Public Relations',        pts: 4.0, dev: "Result Analysis", deps: [] };
  entries['me-ad'] = { pk: 'MEDIA',   sum: 'Advertising',             pts: 4.0, dev: "Result Analysis", deps: [] };
  entries['da-la'] = { pk: 'DATA',    sum: 'Analytics',               pts: 8.0, dev: "Analytics Report", deps: [] };
  entries['pr-co'] = { pk: 'LIVE',    sum: 'Community Management',    pts: 16.0, deps: ['pr-go'] };
  entries['pr-li'] = { pk: 'LIVE',    sum: 'Support',                 pts: 16.0, deps: ['pr-go'] };
  entries['pr-ac'] = { pk: 'ADMIN',   sum: 'Accounting',              pts: 4.0, deps: ['pr-go'] };
  entries['pr-ro'] = { pk: 'ADMIN',   sum: 'Royalty Reporting',       pts: 4.0, dev: "Royalty Report", deps: ['pr-ac'] };
  entries['pr-pr'] = { pk: 'PROD',    sum: 'Production',              pts: 16.0, deps: ['me-so','me-po','me-br','me-di','me-pb','me-ad','da-la','pr-co','pr-li','pr-ac','pr-ro'] };

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
  
  entries['ga-00'] = { pk: 'GAME',   sum: 'Features',                pts: 8.0, dev: "Design Document", deps: [] };
  entries['pr-00'] = { pk: 'PROD',   sum: 'Plan',                    pts: 8.0, dev: "Planning Document", deps: ['ga-00'] };
  entries['bu-00'] = { pk: 'BUILD',  sum: 'Build Configuration',     pts: 8.0, dev: "Infrastructure", deps: ['pr-00'] };
  entries['u3-00'] = { pk: 'UNITY',  sum: 'Input Mapping',           pts: 8.0, dev: "Unity3D Metadata or Component", deps: ['bu-00'] };
  entries['ac-cm'] = { pk: 'ACCESS', sum: 'Compatibility',           pts: 8.0, dev: "Design Update", deps: ['pr-00',] };
  entries['co-cm'] = { pk: 'CODE',   sum: 'Compatibility',           pts: 8.0, dev: "System Code", deps: ['pr-00','ac-cm'] };
  entries['ui-cm'] = { pk: 'UI',     sum: 'Compatibility',           pts: 8.0, dev: "UI Update", deps: ['pr-00','co-cm'] };
  entries['sh-cm'] = { pk: 'SHADE',  sum: 'Compatibility',           pts: 8.0, dev: "Unity3D Shader Updates", deps: ['pr-00','ui-cm'] };
  entries['vf-cm'] = { pk: 'VFX',    sum: 'Compatibility',           pts: 8.0, dev: "Unity3D VFX", deps: ['pr-00','sh-cm'] };
  entries['u3-cm'] = { pk: 'UNITY',  sum: 'Compatibility',           pts: 8.0, dev: "Unity3D Metadata or Component", deps: ['pr-00','vf-cm'] };
  entries['qa-cm'] = { pk: 'QA',     sum: 'Compatibility',           pts: 8.0, dev: "QA Screenshots", deps: ['pr-00','u3-cm'] };
  entries['co-fe'] = { pk: 'CODE',   sum: 'Features',                pts: 8.0, dev: "System Code", deps: ['pr-00'] };
  entries['ui-fe'] = { pk: 'UI',     sum: 'Features',                pts: 8.0, dev: "UI Update", deps: ['pr-00','co-fe'] };
  entries['u3-fe'] = { pk: 'UNITY',  sum: 'Features',                pts: 8.0, dev: "Unity3D Metadata or Component", deps: ['pr-00','ui-fe'] };
  entries['qa-fe'] = { pk: 'QA',     sum: 'Features',                pts: 8.0, dev: "QA Screenshots", deps: ['pr-00','u3-fe'] };
  entries['ui-se'] = { pk: 'UI',     sum: 'Settings',                pts: 8.0, dev: "Game Settings", deps: ['pr-00','ui-fe','ui-cm'] };
  entries['bu-re'] = { pk: 'BUILD',  sum: 'Build Plan',              pts: 8.0, dev: "Infrastructure", deps: ['pr-00','bu-00'] };
  entries['qa-tp'] = { pk: 'QA',     sum: 'Test Plan',               pts: 8.0, dev: "QA Test Plan", deps: ['pr-00'] };
  entries['co-as'] = { pk: 'CODE',   sum: 'Asset Bundling',          pts: 8.0, dev: "LoadAsset Code Updates", deps: ['pr-00'] };
  entries['un-as'] = { pk: 'ASSET',  sum: 'Asset Bundling',          pts: 8.0, dev: "Unity3D Asset Bundle", deps: ['co-as'] };
  entries['co-sc'] = { pk: 'CODE',   sum: 'Schema Migration',        pts: 8.0, dev: "Schema Migration", deps: ['bu-re'] };
  entries['co-la'] = { pk: 'CONCEPT',sum: 'Promotional Symbol',      pts: 8.0, dev: "Illustration", deps: ['pr-00'] };
  entries['ui-up'] = { pk: 'UI',     sum: 'Update Popup',            pts: 8.0, dev: "Update Popup", deps: ['bu-re','co-la'] };
  entries['tc-bp'] = { pk: 'TECH',   sum: 'Build Pipeline',          pts: 8.0, dev: "Infrastructure", deps: ['bu-re','qa-tp','un-as'] };
  entries['bu-ab'] = { pk: 'BUILD',  sum: 'Application Buildout',    pts: 8.0, dev: "Compiled Software", deps: ['ui-up','co-sc','tc-bp'] };
  entries['qa-pl'] = { pk: 'QA',     sum: 'Playthrough',             pts: 8.0, dev: "QA Screenshots", deps: ['qa-tp','bu-ab'] };
  entries['qa-re'] = { pk: 'QA',     sum: 'Regression',              pts: 8.0, dev: "QA Screenshots", deps: ['qa-tp','bu-ab'] };
  entries['qa-sa'] = { pk: 'QA',     sum: 'Saved Game Validation',   pts: 4.0, dev: "QA Screenshots", deps: ['qa-tp','bu-ab'] };
  entries['pr-co'] = { pk: 'PROD',   sum: 'Compliance',              pts: 8.0, dev: "Requirement List", deps: ['pr-00'] };
  entries['qa-co'] = { pk: 'QA',     sum: 'Compliance',              pts: 8.0, dev: "QA Screenshots", deps: ['qa-pl','qa-re','qa-sa','pr-co'] };
  entries['pr-re'] = { pk: 'PROD',   sum: 'Release Plan',            pts: 8.0, dev: "Planning Document", deps: ['pr-co'] };
  entries['un-pr'] = { pk: 'UNITY',  sum: 'Promotional Materials',   pts: 8.0, dev: "Promo Assets", deps: ['pr-re'] };
  entries['me-so'] = { pk: 'MEDIA',  sum: 'Social Media',            pts: 8.0, dev: "Result Analysis", deps: ['un-pr'] };
  entries['me-po'] = { pk: 'MEDIA',  sum: 'Promotions',              pts: 8.0, dev: "Result Analysis", deps: ['un-pr'] };
  entries['me-br'] = { pk: 'MEDIA',  sum: 'Brand Management',        pts: 8.0, dev: "Result Analysis", deps: ['un-pr'] };
  entries['me-di'] = { pk: 'MEDIA',  sum: 'Digital Influence',       pts: 8.0, dev: "Result Analysis", deps: ['un-pr'] };
  entries['me-pb'] = { pk: 'MEDIA',  sum: 'Public Relations',        pts: 8.0, dev: "Result Analysis", deps: ['un-pr'] };
  entries['me-ad'] = { pk: 'MEDIA',  sum: 'Advertising',             pts: 8.0, dev: "Result Analysis", deps: ['un-pr'] };
  entries['da-la'] = { pk: 'DATA',   sum: 'Analytics',               pts: 8.0, dev: "Analytics Report", deps: ['pr-re'] };
  entries['pk-ve'] = { pk: 'PKG',    sum: 'Versioning + Packaging',  pts: 8.0, dev: "Compiled Software", deps: ['pr-re'] };
  entries['tc-ad'] = { pk: 'TECH',   sum: 'Application Delivery',    pts: 8.0, deps: ['pk-ve'] };
  entries['pr-ma'] = { pk: 'PROD',   sum: 'Marketplace Integration', pts: 8.0, deps: ['tc-ad'] };
  entries['pr-pr'] = { pk: 'PROD',   sum: 'Production',              pts: 8.0, deps: ['pr-re','pr-ma'] };
  entries['pr-go'] = { pk: 'LIVE',   sum: 'Go Live',                 pts: 8.0, deps: ['pr-pr'] };

  sharedTags.push("Platform");
}

function getCulture(entries, sharedDeps, sharedTags) {  
  entries['00'] = { pk: 'OUT',       sum: 'Booking',         pts: 1.0, dev: "Contact Information", deps: [] };
  entries['10'] = { pk: 'AUTH',      sum: 'Customs',         pts: 5.0, dev: "Review and Notes", deps: ['00'] };
  entries['11'] = { pk: 'AUTH',      sum: 'Technology',      pts: 5.0, dev: "Review and Notes", deps: ['00'] };
  entries['12'] = { pk: 'AUTH',      sum: 'Food',            pts: 5.0, dev: "Review and Notes", deps: ['00'] };
  entries['13'] = { pk: 'AUTH',      sum: 'Crafting',        pts: 5.0, dev: "Review and Notes", deps: ['00'] };
  entries['14'] = { pk: 'AUTH',      sum: 'Medicine',        pts: 5.0, dev: "Review and Notes", deps: ['00'] };
  entries['15'] = { pk: 'AUTH',      sum: 'Customizations',  pts: 5.0, dev: "Review and Notes", deps: ['00'] };
  entries['99'] = { pk: 'REVIEW',    sum: 'Product Review',  pts: 50.0, dev: "Review", deps: ['10','11','12','13','14','15'] };

  sharedTags.push("Culture");
}

function getLanguage(entries, sharedDeps, sharedTags) { 
  entries['00'] = { pk: 'OUT',  sum: 'Booking',                  pts: 1.0, dev: "Contact Information", deps: [] };
  entries['sp'] = { pk: 'LANG', sum: 'Script Prep',              pts: 1.0, dev: "Game Script", deps: [] };
  entries['tr'] = { pk: 'LANG', sum: 'Translation',              pts: 8.0, dev: "Translation", deps: ['00','sp'] };
  entries['co'] = { pk: 'CODE', sum: 'Translation Integration',  pts: 1.0, dev: "Screenshots", deps: ['tr'] };
  entries['ui'] = { pk: 'UI',   sum: 'Localization',             pts: 1.0, dev: "GUI", deps: ['co'] };
  entries['ad'] = { pk: 'UI',   sum: 'UI Adjustments',           pts: 1.0, dev: "GUI", deps: ['ui'] };
  entries['rv'] = { pk: 'LANG', sum: 'Translation Review',       pts: 1.0, dev: "Review", deps: ['ad'] };
  entries['qa'] = { pk: 'QA',   sum: 'Translation QA',           pts: 1.0, dev: "QA Screenshots",  deps: ['rv'] };

  sharedTags.push("Language");
}

function getSystem(entries, sharedDeps, sharedTags) {  
  entries['ga-00'] = { pk: 'GAME',    sum: 'Feature Design',      pts: 4.0, dev: "Design Document", deps: [] };

  addExperience(entries);  
  addAchievements(entries);
  addStats(entries);
  addSettings(entries);

  entries['sy-00'] = { pk: 'CODE',    sum: 'Architecture',        pts: 8.0, dev: "Architecture Diagram", deps: ['ga-00'] };
  entries['sy-ed'] = { pk: 'CODE',    sum: 'Editor Enhancements', pts: 4.0, dev: "System Code", deps: ['sy-00'] };
  entries['sy-01'] = { pk: 'CODE',    sum: 'Implementation',      pts: 16.0, dev: "System Code", deps: ['sy-ed'] };
  entries['sy-02'] = { pk: 'CODE',    sum: 'API',                 pts: 4.0, dev: "API", deps: ['sy-01'] };
  entries['sy-md'] = { pk: 'CODE',    sum: 'Metadata',            pts: 4.0, dev: "ScriptableObject", deps: ['sy-02'] };
  entries['pk-se'] = { pk: 'PKG',     sum: 'Package Setup',       pts: 2.0, dev: "Compiled Software", deps: ['sy-md'] };
  entries['pk-ru'] = { pk: 'PKG',     sum: 'Runtime Package',     pts: 2.0, dev: "Compiled Software", deps: ['pk-se'] };
  entries['pk-ed'] = { pk: 'PKG',     sum: 'Editor Package',      pts: 2.0, dev: "Compiled Software", deps: ['pk-se'] };
  entries['u3-md'] = { pk: 'UNITY',   sum: 'Metadata',            pts: 4.0, dev: "Unity3D Metadata or Component", deps: ['pk-ru','pk-ed'] };
  entries['qa-00'] = { pk: 'QA',      sum: 'Validation',          pts: 2.0, dev: "QA Signoff", deps: ['u3-md'] };
  entries['pr-rp'] = { pk: 'PROD',    sum: 'Release Plan',        pts: 1.0, dev: "Planning Document", deps: ['qa-00'] };
  entries['da-an'] = { pk: 'DATA',    sum: 'Analytics',           pts: 1.0, dev: "Analytics Integration", deps: ['u3-md'] };
  entries['md-sm'] = { pk: 'MEDIA',   sum: 'Media Shots + Post',  pts: 1.0, dev: "Result Analysis", deps: ['u3-md'] };

  sharedTags.push('System');
}

function addScreen(entries) {
  entries['ca-00'].pts *= 3.0;
  entries['ca-00'].sum = 'UI Concept Art'
  entries['ca-00'].pk = 'UICON';

  entries['qa-00'].pts *= 2.0;

  entries['ui-ux'] = { pk: 'UX',      sum: 'UX Research',              pts: 4.0, dev: "UX Notes", deps: [] };
  entries['ui-ia'] = { pk: 'UX',      sum: 'Information Architecture', pts: 4.0, dev: "Architecture Diagram", deps: ['ga-00','ui-ux'] };
  entries['sy-00'] = { pk: 'CODE',    sum: 'Framework',                pts: 4.0, dev: "System Code", deps: [] };
  entries['sy-ba'] = { pk: 'CODE',    sum: 'Backend API',              pts: 4.0, dev: "API", deps: ['ui-ia'] };
  entries['ui-pr'] = { pk: 'UI',      sum: 'UI Prototype',             pts: 4.0, dev: "Prototype", deps: ['ca-00','ui-ux','ui-ia'] };
  entries['ui-fr'] = { pk: 'UI',      sum: 'Frontend Implementation',  pts: 4.0, dev: "GUI", deps: ['ui-ia','ui-pr','ui-sy'] };
  entries['ui-un'] = { pk: 'UI',      sum: 'Unit Testing',             pts: 2.0, dev: "Unit Testing", deps: ['ui-fr'] };
  entries['ui-ap'] = { pk: 'UI',      sum: 'API Integration',          pts: 2.0, dev: "API", deps: ['ui-fr','sy-ba'] };
  entries['ui-de'] = { pk: 'UI',      sum: 'Developer Testing',        pts: 2.0, dev: "QA Screenshots", deps: ['ui-ap','ui-un'] };

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
  
  addBase(entries);
  addScreen(entries);
  
  scalePoints(entries, 0.5);  

  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addUserInput(entries);

  sharedTags.push('UI');
  sharedTags.push('HUD Overlay');
}

function getWorld(entries, sharedDeps, sharedTags) {
  
  getSystem(entries, sharedDeps, sharedTags);
  
  entries['le-00'] = { pk: 'LEVEL',   sum: 'Configuration', pts: 16.0, dev: "Unity3D Scene", deps: ['u3-md'] };
  entries['vf-99'] = { pk: 'VFX',     sum: 'Effects',       pts: 8.0, dev: "Unity3D VFX", deps: ['u3-md'] };

  delete entries['ca-00']

  sharedTags.length = 0
  sharedTags.push('Environment');
  sharedTags.push('World');
}

function getLevel(entries, sharedDeps, sharedTags) {
  
  entries['ga-00'] = { pk: 'GAME',    sum: 'Design',                pts: 40.0, dev: "Design Document", deps: [] };
  entries['le-00'] = { pk: 'LEVEL',   sum: 'Terrain',               pts: 8.0, dev: "Unity3D Metadata or Component", deps: ['ga-00'] };
  entries['le-as'] = { pk: 'LEVEL',   sum: 'Astronomy',             pts: 4.0, dev: "Unity3D Metadata or Component", deps: ['le-00'] };
  entries['le-ri'] = { pk: 'LEVEL',   sum: 'Rivers',                pts: 8.0, dev: "Unity3D Metadata or Component", deps: ['le-00'] };
  entries['le-po'] = { pk: 'LEVEL',   sum: 'Ponds',                 pts: 8.0, dev: "Unity3D Metadata or Component", deps: ['le-00'] };
  entries['le-sk'] = { pk: 'LEVEL',   sum: 'Sky',                   pts: 8.0, dev: "Unity3D Metadata or Component", deps: ['le-00'] };
  entries['le-st'] = { pk: 'LEVEL',   sum: 'Streams',               pts: 8.0, dev: "Unity3D Metadata or Component", deps: ['le-00'] };
  entries['le-ca'] = { pk: 'LEVEL',   sum: 'Caves',                 pts: 8.0, dev: "Unity3D Metadata or Component", deps: ['le-00'] };
  entries['le-we'] = { pk: 'LEVEL',   sum: 'Weather Patterns',      pts: 8.0, dev: "Unity3D Metadata or Component", deps: ['le-00'] };
  entries['le-co'] = { pk: 'LEVEL',   sum: 'Configuration',         pts: 8.0, dev: "Unity3D Scene", deps: ['le-00','le-sk','le-as','le-we','le-ca','le-st','le-po','le-ri'] };
  entries['le-da'] = { pk: 'UNITY',   sum: 'Discoverable Areas',    pts: 4.0, dev: "Unity3D Metadata or Component", deps: ['le-co'] };
  entries['le-li'] = { pk: 'UNITY',   sum: 'Lightmapping',          pts: 4.0, dev: "Unity3D Metadata or Component", deps: ['le-co'] };
  entries['le-me'] = { pk: 'UNITY',   sum: 'Metadata',              pts: 4.0, dev: "Unity3D Metadata or Component", deps: ['le-da','le-li'] };
  entries['co-in'] = { pk: 'CODE',    sum: 'Integration',           pts: 8.0, dev: "System Code", deps: ['le-me'] };
  entries['le-op'] = { pk: 'LEVEL',   sum: 'Optimization',          pts: 8.0, dev: "Unity3D Metadata or Component", deps: ['co-in'] };
  entries['qa-00'] = { pk: 'QA',      sum: 'Validation',            pts: 8.0, dev: "QA Signoff", deps: ['le-op'] };


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

  delete entries['3d-00']
  delete entries['ca-00']
  
  entries['ad-ss'] = { pk: 'AUDIO',   sum: 'Soundscape',          pts: 16.0, dev: "Unity3D Audio Mix", deps: ['ga-00'] };
  entries['vf-ps'] = { pk: 'VFX',     sum: 'Particle Systems',    pts: 8.0, dev: "Unity3D VFX", deps: ['u3-00'] };
  entries['u3-li'] = { pk: 'UNITY',   sum: 'Lighting',            pts: 8.0, dev: "Unity3D Metadata or Component", deps: ['u3-00','vf-ps'] };
  entries['le-co'] = { pk: 'LEVEL',   sum: 'Configuration',       pts: 8.0, dev: "Unity3D Scene", deps: ['u3-00','u3-li'] };
  entries['ai-00'] = { pk: 'AI',      sum: 'Animal Integration',  pts: 8.0, dev: "AI Graph", deps: ['le-co'] };
  entries['u3-pp'] = { pk: 'UNITY',   sum: 'Post-Processing',     pts: 8.0, dev: "Unity3D Metadata or Component", deps: ['le-co'] };
  entries['le-op'] = { pk: 'LEVEL',   sum: 'Optimization',        pts: 8.0, dev: "Unity3D Metadata or Component", deps: ['u3-pp'] };
  entries['qa-00'] = { pk: 'QA',      sum: 'Validation',          pts: 4.0, dev: "QA Signoff", deps: ['le-op'] };
  
  sharedTags.push('Environment');
  sharedTags.push('Biome');
}

function getProp(entries, sharedDeps, sharedTags) {
  
  addBase(entries);
  addSettings(entries);
  addPrefab(entries);
  addModels(entries);

  delete entries['ca-00'];

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

  delete entries['3d-00']
  delete entries['ca-00']

  entries['vf-op'] = { pk: 'VFX',     sum: 'Screen Effects',          pts: 8.0, dev: "Unity3D Shader", deps: ['u3-00'] };
  entries['u3-bi'] = { pk: 'LEVEL',   sum: 'Weather Configuration',   pts: 8.0, dev: "Unity3D Prefab", deps: ['vf-op'] };

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

  delete entries['ca-00']
  
  entries['u3-si'] = { pk: 'UNITY',   sum: 'Lightmapping',      pts: 3.0, dev: "Unity3D Metadata or Component", deps: ['u3-00'] };
  entries['u3-si'] = { pk: 'LEVEL',   sum: 'Scene Integration', pts: 3.0, dev: "Unity3D Metadata or Component", deps: ['u3-00'] };

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
}

function addFeathers(entries) {
  entries['te-fe'] = { pk: 'TEXTURE', sum: 'Feathers',            pts: 1.0, dev: "PBR Texture Set", deps: ['te-00'] };
  entries['u3-00'].deps.push('te-fe');
}

function addQuadruped(entries) {
  entries['te-tr'] = { pk: 'TEXTURE', sum: 'Tracks',              pts: 1.0, dev: "PBR Texture Set", deps: [] };  
  entries['3d-rh'] = { pk: '3D',      sum: 'Hide',                pts: 1.0, dev: "FBX 3D Model", deps: ['ca-00','ga-00'] };
  entries['te-rh'] = { pk: 'TEXTURE', sum: 'Rawhide',             pts: 1.0, dev: "PBR Texture Set", deps: [] };
  entries['te-th'] = { pk: 'TEXTURE', sum: 'Tanned Hide',         pts: 1.0, dev: "PBR Texture Set", deps: [] };
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

function getHarvestablePlant(entries, sharedDeps, sharedTags) {
  
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
  
  delete entries['ca-00'];
  entries["ga-00"].points *= 1.5;

  sharedTags.push('Harvestable')
  sharedTags.push('Flora');
}

function getTree(entries, sharedDeps, sharedTags) {
  getHarvestablePlant(entries, sharedDeps, sharedTags);
  sharedTags.push('Tree');
}

function getShrub(entries, sharedDeps, sharedTags) {
  getHarvestablePlant(entries, sharedDeps, sharedTags);
  sharedTags.push('Shrub');
}

function getVine(entries, sharedDeps, sharedTags) {
  getHarvestablePlant(entries, sharedDeps, sharedTags);
  sharedTags.push('Vine');
}

function getHerb(entries, sharedDeps, sharedTags) {
  getHarvestablePlant(entries, sharedDeps, sharedTags);
  sharedTags.push('Herb');
}

function getFlower(entries, sharedDeps, sharedTags) {
  getHarvestablePlant(entries, sharedDeps, sharedTags);
  sharedTags.push('Flower');
}

function getGrass(entries, sharedDeps, sharedTags) {
  getHarvestablePlant(entries, sharedDeps, sharedTags);
  sharedTags.push('Grass');
}

function getFern(entries, sharedDeps, sharedTags) {
  getHarvestablePlant(entries, sharedDeps, sharedTags);
  sharedTags.push('Fern');
}

function getSeaweed(entries, sharedDeps, sharedTags) {
  getHarvestablePlant(entries, sharedDeps, sharedTags);
  sharedTags.push('Seaweed');
}

function getLichen(entries, sharedDeps, sharedTags) {
  getHarvestablePlant(entries, sharedDeps, sharedTags);
  sharedTags.push('Lichen');
}

function getMushroom(entries, sharedDeps, sharedTags) {
  getHarvestablePlant(entries, sharedDeps, sharedTags);
  sharedTags.push('Mushroom');
}

function getGenericPlant(entries, sharedDeps, sharedTags) {  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addSettings(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);

  delete entries['ca-00'];

  sharedTags.push('Flora');
}

function getFood(entries, sharedDeps, sharedTags) {  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);
  addInventory(entries);
  addDetails(entries);
  addFoodPreparation(entries);

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
  addDetails(entries);
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
  addUpgrades(entries);
  addDetails(entries);

  sharedTags.push('Item');
}

function getCrafting(entries, sharedDeps, sharedTags) {
  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);
  addInventory(entries);
  addCrafting(entries);
  addDetails(entries);

  scalePoints(entries, .5);

  sharedTags.push('Crafting');
}

function getRawMaterial(entries, sharedDeps, sharedTags) {
  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);
  addInventory(entries);
  addCrafting(entries);
  addDetails(entries);

  scalePoints(entries, .5);

  sharedTags.push('Raw Material');
}

function getWood(entries, sharedDeps, sharedTags) {
  
  addBase(entries);
  addExperience(entries);
  addAchievements(entries);
  addStats(entries);
  addInventory(entries);
  addDetails(entries);

  scalePoints(entries, .5);
  
  delete entries['ca-00'];
  delete entries['ga-00'];
  delete entries['ga-sy'];
  delete entries['ca-sy'];
  delete entries['ui-sy'];

  entries['te-pc'] = { pk: 'TEXTURE', sum: 'Plain Cut',  pts: 1.0, dev: "PBR Texture Set", deps: [] };
  entries['te-cc'] = { pk: 'TEXTURE', sum: 'Crown Cut',  pts: 1.0, dev: "PBR Texture Set", deps: [] };
  entries['te-lc'] = { pk: 'TEXTURE', sum: 'Live Cut',   pts: 1.0, dev: "PBR Texture Set", deps: [] };
  entries['te-rc'] = { pk: 'TEXTURE', sum: 'Rift Cut',   pts: 1.0, dev: "PBR Texture Set", deps: [] };

  sharedTags.push('Wood');
}

function getCustomization(entries, sharedDeps, sharedTags) {
  
  addBase(entries);
  addAchievements(entries);
  addStats(entries);
  addPrefab(entries);
  addModels(entries);

  sharedTags.push('Customization');
}


function addMusic(entries) {    
  entries['mu-00'] = { pk: 'MUSIC', sum: 'Composition',    pts: 160.0, dev: "Music", deps: [] };
  entries['mu-or'] = { pk: 'MUSIC', sum: 'Orchestration',  pts: 24.0, dev: "Music", deps: ['mu-00'] };
  entries['mu-co'] = { pk: 'MUSIC', sum: 'Conducting',     pts: 8.0, dev: "Music", deps: ['mu-or'] };
  entries['mu-pe'] = { pk: 'MUSIC', sum: 'Performance',    pts: 80.0, dev: "Music", deps: ['mu-co'] };
  entries['mu-re'] = { pk: 'MUSIC', sum: 'Recording',      pts: 16.0, dev: "Music", deps: ['mu-pe'] };
  entries['mu-mi'] = { pk: 'MUSIC', sum: 'Mixing',         pts: 16.0, dev: "Music", deps: ['mu-re'] };
  entries['mu-ma'] = { pk: 'MUSIC', sum: 'Mastering',      pts: 16.0, dev: "Music", deps: ['mu-mi'] };
  entries['mu-pr'] = { pk: 'MUSIC', sum: 'Production',     pts: 16.0, dev: "Music", deps: ['mu-ma'] };
  entries['mu-li'] = { pk: 'MUSIC', sum: 'Librarian',      pts: 4.0, deps: ['mu-pr'] };
}

function getSoundtrackMusic(entries, sharedDeps, sharedTags) {
  
  addMusic(entries);

  sharedTags.push('Soundtrack');
}

function getTrailerMusic(entries, sharedDeps, sharedTags) {
  
  addMusic(entries);

  scalePoints(entries, .1);

  sharedTags.push('Trailer');
}

function populateFeatures(ctx) {
  if (!"Category" in ctx.issue.fields) {
    return;
  }
  
  var t0 = Date.now();

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
    case 'Shrub':
      getShrub(entries, sharedDeps, sharedTags);
      break;
    case 'Vine':
      getVine(entries, sharedDeps, sharedTags);
      break;
    case 'Herb':
      getHerb(entries, sharedDeps, sharedTags);
      break;
    case 'Flower':
      getFlower(entries, sharedDeps, sharedTags);
      break;
    case 'Grass':
      getGrass(entries, sharedDeps, sharedTags);
      break;
    case 'Fern':
      getFern(entries, sharedDeps, sharedTags);
      break;
    case 'Seaweed':
      getSeaweed(entries, sharedDeps, sharedTags);
      break;
    case 'Lichen':
      getLichen(entries, sharedDeps, sharedTags);
      break;
    case 'Mushroom':
      getMushroom(entries, sharedDeps, sharedTags);
      break;
    case 'Generic Plant':
      getGenericPlant(entries, sharedDeps, sharedTags);
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
    case 'Soundtrack Music':
      getSoundtrackMusic(entries, sharedDeps, sharedTags);
      break;
    case 'Trailer Music':
      getTrailerMusic(entries, sharedDeps, sharedTags);
      break;
    case 'Feature Set':
      return;
    case 'General':
      return;
    default:
      throw 'Undefined case in feature-populate!: ' + category;
  }     
  
  validateEntries(entries);

  createComplexIssues(
    ctx,
    ctx.issue, 
    entries,
    sharedDeps,
    sharedTags,
    );
    
    var t1 = Date.now();        
    console.log(ctx.issue.summary + ": " + (t1 - t0) + " ms");
}

module.exports = {
  populateFeatures: populateFeatures,
};
