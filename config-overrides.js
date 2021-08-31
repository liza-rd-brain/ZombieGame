const rewireStyledComponents = require("react-app-rewire-styled-components");

module.exports = function override(config, env) {
  config = rewireStyledComponents(config, env, {
    fileName: false,
    minify: false,
    transpileTemplateLiterals: false,
  });
  return config;
};
