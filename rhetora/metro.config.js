const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

const projectRoot = __dirname;

// Point each module to its correct file in YOUR node_modules
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const moduleMap = {
    "react":                    "react/index.js",
    "react/jsx-runtime":        "react/jsx-runtime.js",
    "react/jsx-dev-runtime":    "react/jsx-dev-runtime.js",
    "react-native":             "react-native/index.js",
  };

  if (moduleMap[moduleName]) {
    return {
      filePath: path.resolve(projectRoot, "node_modules", moduleMap[moduleName]),
      type: "sourceFile",
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;