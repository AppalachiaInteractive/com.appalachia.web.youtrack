const entities = require("@jetbrains/youtrack-scripting-api/entities");
const search = require("@jetbrains/youtrack-scripting-api/search");
const appalachia = require("youtrack-appalachia/appalachia");

exports.rule = entities.Issue.action({
  title: "Populate Release Features",
  command: "populate-release-features",
  guard: (ctx) => appalachia.guards.featureSet(ctx.issue),
  action: (ctx) => {
    const issue = ctx.issue;

    const query =
      "Category: -{Feature Set},-{Build},-{Release}, and Target Release: {" +
      issue.fields["Target Release"].presentation +
      "}";
    const features = search.search(issue.project, query, ctx.currentUser);

    if (features.isEmpty()) {
      return;
    }

    issue.links["depends on"].clear();

    features.forEach((f) => {
      issue.links["depends on"].add(f);
    });
  },
  requirements: appalachia.requirements.featureRoadmap,
});
