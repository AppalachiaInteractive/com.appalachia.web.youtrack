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

function updateIssue(existing, v, parentIssue, tag, project, user, owner) {
  parentIssue.links["depends on"].add(existing);

  existing.summary = parentIssue.summary + " " + v.sum;
  existing.project = project;
  existing.fields.Assignee = user;
  existing.fields.Points = v.pts;
  existing.fields.Owner = owner;
  existing.fields.TargetRelease = parentIssue.TargetRelease;

  existing.addTag(tag);
  existing.addTag("Auto-Generated");

  const tag2 = cleanTag(v.sum);

  if (tag2 !== "") {
    existing.addTag(tag2);
  }

  if (
    existing.fields.Owner !== null &&
    existing.fields.Owner !== undefined &&
    existing.fields.Owner.name !== "Appalachia Interactive"
  ) {
    const ownerTag = "Suggestion: " + existing.fields.Owner.name;
    existing.addTag(ownerTag);
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
    var owner = appalachia_entities.owners[userName];

    qpr = "project: {" + project.name + "}";
    qpa = "'" + parentIssue.summary + "'";
    qsa = "State: {Not Ready},Open";
    qde = "Is required for: " + parentIssue.id;
    qvs = "'" + v.sum + "'";

    and = ' and ';

    queries = [];

    if (v.sum == '' ) {
      queries.push(qpr + and + qpa + and + qsa + and + qde);
    }
    else{
      queries.push(qpr + and + qpa + and + qsa + and + qvs + and + qde);
    }
    
    var existing = getIssue(ctx, project, queries);

    if (existing == null) {      
      existing = new entities.Issue(ctx.currentUser, project, parentIssue.summary + " " + v.sum);
    }

    issues[k] = existing;

    updateIssue(existing, v, parentIssue, tag, project, user, owner);
  }

  updateLinks(issues, entries);
  updateSharedDeps(issues, parentIssue, sharedDeps);
  updateSharedTags(issues, parentIssue, sharedTags);
}

module.exports = {
  createComplexIssues: createComplexIssues,
};
