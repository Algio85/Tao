const StyleDictionary = require("style-dictionary");

// Custom name transform — preserves dashes
StyleDictionary.registerTransform({
  name: 'name/tao/kebab',
  type: 'name',
  transformer: function(token) {
    return 'tao-' + token.path.join('-');
  }
});

// Custom OKLCH → hex transform
StyleDictionary.registerTransform({
  name: 'color/oklch-to-hex',
  type: 'value',
  matcher: function(token) {
    return typeof token.value === 'string' && token.value.indexOf('oklch') === 0;
  },
  transformer: function(token) {
    var str = token.value;
    var match = str.match(/oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/);
    if (!match) return token.value;

    var L = parseFloat(match[1]);
    var C = parseFloat(match[2]);
    var H = parseFloat(match[3]);

    if (L > 1) L = L / 100;

    var hRad = H * Math.PI / 180;
    var a = C * Math.cos(hRad);
    var b = C * Math.sin(hRad);

    var l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    var m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    var s_ = L - 0.0894841775 * a - 1.291485548  * b;

    var lc = l_ * l_ * l_;
    var mc = m_ * m_ * m_;
    var sc = s_ * s_ * s_;

    function toSrgb(v) {
      v = Math.max(0, Math.min(1, v));
      return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1/2.4) - 0.055;
    }

    var r  = Math.round(toSrgb( 4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc) * 255);
    var g  = Math.round(toSrgb(-1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc) * 255);
    var bv = Math.round(toSrgb(-0.0041960863 * lc - 0.7034186147 * mc + 1.707614701  * sc) * 255);

    r  = Math.max(0, Math.min(255, r));
    g  = Math.max(0, Math.min(255, g));
    bv = Math.max(0, Math.min(255, bv));

    return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + bv.toString(16).padStart(2, '0');
  }
});

// Transform group
StyleDictionary.registerTransformGroup({
  name: 'tao/css',
  transforms: ['attribute/cti', 'name/tao/kebab', 'color/oklch-to-hex', 'color/css', 'size/rem']
});

StyleDictionary.registerFormat({
  name: "css/custom-properties",
  formatter: function({ dictionary }) {
    var lines = dictionary.allTokens.map(function(token) {
      return '  --' + token.name + ': ' + token.value + ';';
    });
    return ':root {\n' + lines.join('\n') + '\n}\n';
  },
});

StyleDictionary.registerFormat({
  name: "json/flat",
  formatter: function({ dictionary }) {
    var out = {};
    dictionary.allTokens.forEach(function(token) {
      out[token.name] = token.value;
    });
    return JSON.stringify(out, null, 2);
  },
});

module.exports = {
  source: [
    "../tokens/base/shades.json",
    "../tokens/base/spacing.json",
    "../tokens/base/borders.json",
    "../tokens/base/typography.json",
    "../tokens/base/opacity.json",
    "../tokens/base/motion.json",
    "../tokens/base/elevation.json",
    "../tokens/semantic/surfaces.json",
    "../tokens/semantic/text.json",
    "../tokens/semantic/borders.json",
    "../tokens/semantic/states.json",
    "../tokens/components/button.json",
  ],
  platforms: {
    css: {
      transformGroup: "tao/css",
      buildPath: "../build/css/",
      files: [
        {
          destination: "tokens.css",
          format: "css/custom-properties",
        },
      ],
    },
    json: {
      transformGroup: "tao/css",
      buildPath: "../build/json/",
      files: [
        {
          destination: "tokens.json",
          format: "json/flat",
        },
      ],
    },
    js: {
      transformGroup: "tao/css",
      buildPath: "../build/js/",
      files: [
        {
          destination: "tokens.js",
          format: "javascript/es6",
        },
      ],
    },
  },
};