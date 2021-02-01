module.exports = function (config) {
  config.set({
    basePath: "../",

    files: [
      "../lib/coinbase-bots.min.js",
      "unit/**/*.js",
    ],

    proxies: {
      "/local": "http://localhost",
    },

    autoWatch: true,

    client: {
      jasmine: {
        random: false,
      },
    },

    singleRun: true,

    frameworks: ["jasmine"],

    browsers: ["Chrome"],

    plugins: [
      "karma-junit-reporter",
      "karma-chrome-launcher",
      "karma-firefox-launcher",
      "karma-jasmine",
    ],

    junitReporter: {
      outputFile: "test_out/unit.xml",
      suite: "main",
    },
  });
};
