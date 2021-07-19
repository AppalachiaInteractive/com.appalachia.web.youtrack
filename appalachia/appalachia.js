const dependencies = require("appalachia/functions-dependencies");
const entities = require("appalachia/workflow-entities");
const features = require("appalachia/functions-features");
const guards = require("appalachia/workflow-guards");
const populate = require("appalachia/functions-populate");
const requirements = require("appalachia/workflow-requirements");

module.exports = {
  dependencies: dependencies,
  entities: entities,
  features: features,
  guards: guards,
  populate: populate,
  requirements: requirements
};
