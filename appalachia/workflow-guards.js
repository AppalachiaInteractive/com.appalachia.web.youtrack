module.exports = {
  allowAll: (ctx) => true,
  allowNone: (ctx) => false,
  hasDependencies: (ctx) => {
    return ctx.issue.links["depends on"].isNotEmpty();
  },
  featureSet: (ctx) => {
    return ctx.issue.fields["Category"].presentation == "Feature Set";
  },
  screen: (ctx) => {
    return ctx.issue.fields["Category"].presentation == "Screen";
  },
  hudOverlay: (ctx) => {
    return ctx.issue.fields["Category"].presentation == "HUD Overlay";
  },
  build: (ctx) => {
    return ctx.issue.fields["Category"].presentation == "Build";
  },
  technology: (ctx) => {
    return ctx.issue.fields["Category"].presentation == "Weapon Or Tool";
  },
  tree: (ctx) => {
    return ctx.issue.fields["Category"].presentation == "Tree";
  },
  plant: (ctx) => {
    return ctx.issue.fields["Category"].presentation == "Plant";
  },
  grass: (ctx) => {
    return ctx.issue.fields["Category"].presentation == "Grass";
  },
  crop: (ctx) => {
    return ctx.issue.fields["Category"].presentation == "Crop";
  },
  fungus: (ctx) => {
    return ctx.issue.fields["Category"].presentation == "Fungus";
  },
  fish: (ctx) => {
    return ctx.issue.fields["Category"].presentation == "Fish";
  },
  mammal: (ctx) => {
    return ctx.issue.fields["Category"].presentation == "Mammal";
  },
  bird: (ctx) => {
    return ctx.issue.fields["Category"].presentation == "Bird";
  },
  reptile: (ctx) => {
    return ctx.issue.fields["Category"].presentation == "Reptile & Amphibian";
  },
  animal: (ctx) => {
    const cat = ctx.issue.fields["Category"];
    return (
      cat == "Fish" ||
      cat == "Mammal" ||
      cat == "Bird" ||
      cat == "Reptile & Amphibian"
    );
  },
};
