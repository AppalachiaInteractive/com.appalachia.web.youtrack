const entities = require("@jetbrains/youtrack-scripting-api/entities");
const search = require("@jetbrains/youtrack-scripting-api/search");
const appalachia_entities = require("appalachia/workflow-entities");

function setIssueToParentRelease(issue, dep, force) {
  console.log("setIssueToParentRelease - " + issue.id + ' - ' + issue.summary);

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
  console.log("setDependencyReleases - " + issue.id + ' - ' + issue.summary);

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

module.exports = {
  setDependencyReleases: setDependencyReleases,
};
