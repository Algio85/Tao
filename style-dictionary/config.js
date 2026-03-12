const StyleDictionary = require("style-dictionary");

// Custom format: CSS custom properties
StyleDictionary.registerFormat({
  name: "css/custom-properties",
  formatter: ({ dictionary }) => {
    const lines = dictionary.allTokens.map((token) => {
      return `  --${token.name}: ${token.value};`;
    });
    return `:root {\n${lines.join("\n")}\n}\n`;
  },
});

// Custom format: flat JSON (name → value)
StyleDictionary.registerFormat({
  name: "json/flat",
  formatter: ({ dictionary }) => {
    const out = {};
    dictionary.allTokens.forEach((token) => {
      out[token.name] = token.value;
    });
    return JSON.stringify(out, null, 2);
  },
});

module.exports = {
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "css",
      prefix: "ds",
      buildPath: "build/css/",
      files: [
        {
          destination: "tokens.css",
          format: "css/custom-properties",
        },
      ],
    },
    json: {
      transformGroup: "js",
      prefix: "ds",
      buildPath: "build/json/",
      files: [
        {
          destination: "tokens.json",
          format: "json/flat",
        },
      ],
    },
    js: {
      transformGroup: "js",
      prefix: "ds",
      buildPath: "build/js/",
      files: [
        {
          destination: "tokens.js",
          format: "javascript/es6",
        },
      ],
    },
  },
};
