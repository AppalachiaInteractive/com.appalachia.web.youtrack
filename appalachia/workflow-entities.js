

const users = {
  bokbok: "bokbok",  
  chris: "chris",
  janice: "janice",
  DIG_Voice: "DIG_Voice",
  external: "external",
  TBD: "TBD"
};

const owners = {};
owners[users.bokbok] = "Bok Bok Productions";
owners[users.chris] = "Appalachia Interactive";
owners[users.janice] = "Appalachia Interactive";
owners[users.DIG_Voice] = "DIG Voice";
owners[users.external] = null;
owners[users.TBD] = null;


const project_keys = {
  _3D: "3D",
  ACCESS: "ACCESS",
  ADMIN: "ADMIN",
  AI: "AI",
  ANIM: "ANIM",
  ASSET: "ASSET",
  AUDIO: "AUDIO",
  AUTH: "AUTH",
  BUILD: "BUILD",
  CODE: "CODE",
  CONCEPT: "CONCEPT",
  DATA: "DATA",
  FEATURE: "FEATURE",
  GAME: "GAME",
  LANG: "LANG",
  LEVEL: "LEVEL",
  LIVE: "LIVE",
  MEDIA: "MEDIA",
  MUSIC: "MUSIC",
  OUT: "OUT",
  PKG: "PKG",
  PROD: "PROD",
  QA: "QA",
  REVIEW: "REVIEW",
  SHADE: "SHADE",
  SYMBOL: "SYMBOL",
  TECH: "TECH",
  TEXTURE: "TEXTURE",
  UI: "UI",
  UICON: "UICON",
  UNITY: "UNITY",
  UX: "UX",
  VFX: "VFX",
};

all_project_keys = [
project_keys._3D,
project_keys.ACCESS,
project_keys.ADMIN,
project_keys.AI,
project_keys.ANIM,
project_keys.ASSET,
project_keys.AUDIO,
project_keys.AUTH,
project_keys.BUILD,
project_keys.CODE,
project_keys.CONCEPT,
project_keys.DATA,
project_keys.FEATURE,
project_keys.GAME,
project_keys.LANG,
project_keys.LEVEL,
project_keys.LIVE,
project_keys.MEDIA,
project_keys.MUSIC,
project_keys.OUT,
project_keys.PKG,
project_keys.PROD,
project_keys.QA,
project_keys.REVIEW,
project_keys.SHADE,
project_keys.SYMBOL,
project_keys.TECH,
project_keys.TEXTURE,
project_keys.UI,
project_keys.UICON,
project_keys.UNITY,
project_keys.UX,
project_keys.VFX,
];

const assignees = {};
assignees[project_keys._3D] = users.chris;
assignees[project_keys.ACCESS] = users.chris;
assignees[project_keys.ADMIN] = users.chris;
assignees[project_keys.AI] = users.chris;
assignees[project_keys.ANIM] = users.chris;
assignees[project_keys.ASSET] = users.chris;
assignees[project_keys.AUDIO] = users.TBD;
assignees[project_keys.AUTH] = users.external;
assignees[project_keys.BUILD] = users.chris;
assignees[project_keys.CODE] = users.chris;
assignees[project_keys.CONCEPT] = users.bokbok;
assignees[project_keys.DATA] =  users.janice;
assignees[project_keys.FEATURE] = users.chris;
assignees[project_keys.GAME] = users.TBD;
assignees[project_keys.LANG] = users.external;
assignees[project_keys.LEVEL] = users.TBD;
assignees[project_keys.LIVE] = users.DIG_Voice;
assignees[project_keys.MEDIA] = users.TBD;
assignees[project_keys.MUSIC] = users.external;
assignees[project_keys.OUT] = users.bokbok;
assignees[project_keys.PKG] = users.chris;
assignees[project_keys.PROD] = users.TBD;
assignees[project_keys.QA] = users.DIG_Voice;
assignees[project_keys.REVIEW] = users.external;
assignees[project_keys.SHADE] = users.chris;
assignees[project_keys.SYMBOL] = users.bokbok;
assignees[project_keys.TECH] = users.chris;
assignees[project_keys.TEXTURE] = users.chris;
assignees[project_keys.UI] =  users.janice;
assignees[project_keys.UICON] = users.bokbok;
assignees[project_keys.UNITY] = users.TBD;
assignees[project_keys.UX] =  users.janice;
assignees[project_keys.VFX] = users.chris;


module.exports = {
  users: users,
  owners: owners,
  project_keys: project_keys,
  all_project_keys: all_project_keys,
  assignees: assignees,
};
