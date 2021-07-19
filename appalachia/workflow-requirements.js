const entities = require("@jetbrains/youtrack-scripting-api/entities");

module.exports = {
  none: {},
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
