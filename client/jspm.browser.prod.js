SystemJS.config({
  baseURL: "/",
  production: true,
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*",
    "client/": "src/"
  }
});
