const dependencies = require("appalachia/functions-dependencies");
const entities = require("appalachia/workflow-entities");
const populate = require("appalachia/functions-populate");
const search = require("appalachia/functions-search");
const requirements = require("appalachia/workflow-requirements");

module.exports = {
  dependencies: dependencies,
  entities: entities,
  populate: populate,
  requirements: requirements,
  search: search
};
