SystemJS.config({
  transpiler: "plugin-babel",
  packages: {
    "slackviz": {
      "main": "slackviz.js",
      "meta": {
        "*.js": {
          "loader": "plugin-babel"
        }
      }
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json"
  ],
  map: {
    "plugin-babel": "npm:systemjs-plugin-babel@0.0.12"
  },
  packages: {}
});
