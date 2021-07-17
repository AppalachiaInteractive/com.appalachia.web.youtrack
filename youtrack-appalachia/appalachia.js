const entities = require("@jetbrains/youtrack-scripting-api/entities");
const search = require("@jetbrains/youtrack-scripting-api/search");

const owners = {};
owners["bokbok"] = "Bok Bok Productions";
owners["chris"] = "Appalachia Interactive";
owners["janice"] = "Appalachia Interactive";
owners["DIG_Voice"] = "DIG Voice";
owners["TBD"] = null;

const assignees = {};
assignees["3D"] = "chris";
assignees["ACCESS"] = "TBD";
assignees["ANIM"] = "chris";
assignees["AUDIO"] = "DIG_Voice";
assignees["CONCEPT"] = "bokbok";
assignees["DATA"] = "janice";
assignees["FEATURE"] = "chris";
assignees["GAME"] = "TBD";
assignees["LANG"] = "TBD";
assignees["MEDIA"] = "TBD";
assignees["MUSIC"] = "TBD";
assignees["PKG"] = "chris";
assignees["PROD"] = "TBD";
assignees["QA"] = "DIG_Voice";
assignees["REACT"] = "bokbok";
assignees["SYMBOL"] = "bokbok";
assignees["CODE"] = "chris";
assignees["TECH"] = "chris";
assignees["TEXTURE"] = "chris";
assignees["UNITY"] = "TBD";
assignees["UI"] = "janice";
assignees["VFX"] = "chris";

function setIssueToParentRelease(issue, dep, force) {
  if (issue.project.isArchived || !issue.isReported) {
    return;
  }
  if (dep.project.isArchived || !dep.isReported) {
    return;
  }

  const issueRelease = issue.fields["Target Release"];
  const depRelease = dep.fields["Target Release"];

  if (force || issueRelease.ordinal < depRelease.ordinal) {
    dep.fields["Target Release"] = issueRelease;
  }
}

function setDependencyReleases(issue, force) {
  if (issue.links["depends on"].isEmpty()) {
    return;
  }

  issue.links["depends on"].forEach(function (dep) {
    setIssueToParentRelease(issue, dep, force);

    if (dep.links["depends on"].isNotEmpty()) {
      setDependencyReleases(dep, force);
    }
  });
}

function createComplexIssues(parent, entries) {
  const parentSummary = parent.summary;
  const tag = parentSummary;

  const issues = {};

  parent.addTag(tag);

  for (const [k, v] of Object.entries(entries)) {
    var project = entities.Project.findByKey(v.pk);
    var userName = assignees[v.pk];
    var user = entities.User.findByLogin(userName);

    var owner = owners[userName];

    var matches = search.search(project, v.sum, ctx.currentUser);

    var existing = null;

    if (matches.isNotEmpty()) {
      existing = matches.first();
    } else {
      existing = new entities.Issue(ctx.currentUser, project, "Task");
    }

    issues[k] = existing;

    parent.links["depends on"].add(existing);

    existing.summary = parentSummary + " " + v.sum;
    existing.project = project;
    existing.fields.Assignee = user;
    existing.fields.Points = v.pts;
    existing.fields.Owner = owner;
    existing.fields.TargetRelease = parent.TargetRelease;

    existing.addTag(tag);
    existing.addTag(v.sum);
    if (
      existing.Owner !== null &&
      existing.Owner !== undefined &&
      existing.Owner !== "Appalachia Interactive"
    ) {
      existing.addTag("Suggestion: " + existing.Owner);
    }
  }

  for (const [k, v] of Object.entries(entries)) {
    const issue = issues[k];

    issue.deps.forEach((dk) => {
      const dependency = issues[dk];
      issue.links["depends on"].add(dependency);
    });
  }
}

const queries = {};

const guards = {
  allowAll: (issue) => true,
  allowNone: (issue) => false,
  featureSet: (issue) => issue.fields["Category"].presentation == "Feature Set",
  build: (issue) => issue.fields["Category"].presentation == "Build",
  technology: (issue) =>
    issue.fields["Category"].presentation == "Weapon Or Tool",
};

const requirements = {
  anyProject: {
    TargetRelease: {
      name: "Target Release",
      type: entities.ProjectVersion.fieldType,
      multi: false,
    },
    Depend: {
      type: entities.IssueLinkPrototype,
      outward: "is required for",
      inward: "depends on",
    },
  },
  featureRoadmap: {
    TargetRelease: {
      name: "Target Release",
      type: entities.ProjectVersion.fieldType,
      multi: false,
    },
    Category: {
      name: "Category",
      type: entities.EnumField.fieldType,
      multi: false,
    },
    Depend: {
      type: entities.IssueLinkPrototype,
      outward: "is required for",
      inward: "depends on",
    },
  },
};

module.exports = {
  owners: owners,
  assignees: assignees,
  setDependencyReleases: setDependencyReleases,
  createComplexIssues: createComplexIssues,
  queries: queries,
  guards: guards,
  requirements: requirements,
};
