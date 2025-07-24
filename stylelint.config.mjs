/** @type {import('stylelint').Config} */
export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-standard-scss",
    "stylelint-config-html/astro",
    "stylelint-config-clean-order",
  ],
  plugins: [
    "stylelint-scss",
    "stylelint-use-nesting",
    "stylelint-high-performance-animation",
  ],
  rules: {
    // recommended rules
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,
    "selector-class-pattern": null,
    "csstools/use-nesting": "always",
    "plugin/no-low-performance-animation-properties": true,
  },
};
