SystemJS.config({
  baseURL: "/",
  trace: true,
  paths: {
    "github:": "jspm_packages/github/",
    "github:*": "jspm_packages/github/*",
    "npm:": "jspm_packages/npm/",
    "npm:*": "jspm_packages/npm/*"
  }
});
