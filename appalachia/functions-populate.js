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

function getIssue(ctx, project, query) {
  var matches = search.search(project, query, ctx.currentUser);

  var existing = null;

  if (matches.isNotEmpty()) {
    if (matches.length > 1) {
      console.log(
        "> " + query + "\nSkipping because of multiple matches\n" + matches
      );
      return null;
    } else {
      existing = matches.first();
    }
  } else {
    existing = new entities.Issue(ctx.currentUser, project, "Task");
  }

  return existing;
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

function updateSharedDeps(issues, sharedDeps) {
  sharedDeps.forEach((sd) => {
    const sharedDep = entities.Issue.findById(sd);

    for (const [k, issue] of Object.entries(issues)) {
      issue.links["depends on"].add(sharedDep);
    }
  });
}

function updateSharedTags(issues, sharedTags) {
  for (const [k, issue] of Object.entries(issues)) {
    sharedTags.forEach((tag) => {
      issue.addTag(tag);
    });
  }
}

function createComplexIssues(
  ctx,
  parentIssue,
  entries,
  sharedDeps,
  sharedTags
) {
  console.log(
    "createComplexIssues - " + parentIssue.id + " - " + parentIssue.summary
  );
  const parentSummary = parentIssue.summary;
  const tag = cleanTag(parentSummary);
  parentIssue.addTag(tag);

  const issues = {};

  for (const [k, v] of Object.entries(entries)) {
    var project = entities.Project.findByKey(v.pk);
    var userName = appalachia_entities.assignees[v.pk];
    var user = entities.User.findByLogin(userName);
    var owner = appalachia_entities.owners[userName];

    const query = "'" + parentIssue.summary + "' and '" + v.sum + "'";
    var existing = getIssue(ctx, project, query);

    issues[k] = existing;

    updateIssue(existing, v, parentIssue, tag, project, user, owner);
  }

  updateLinks(issues, entries);
  updateSharedDeps(issues, sharedDeps);
  updateSharedTags(issues, sharedTags);
}

module.exports = {
  createComplexIssues: createComplexIssues,
};
