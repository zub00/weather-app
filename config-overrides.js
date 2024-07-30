const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addWebpackModuleRule({
    test: /\.mjs$/,
    enforce: 'pre',
    use: ['source-map-loader'],
    resolve: {
      fullySpecified: false
    }
  }),
  config => {
    config.ignoreWarnings = [
      {
        module: /@mediapipe\/tasks-vision/,
        message: /Failed to parse source map/
      }
    ];
    return config;
  }
);
