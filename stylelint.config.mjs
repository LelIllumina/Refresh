/** @type {import('stylelint').Config} */
export default {
  extends: [
    "stylelint-config-html/astro",
    "stylelint-config-standard",
    "stylelint-config-clean-order",
  ],
  plugins: ["stylelint-scss"],
  rules: {
    // recommended rules
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,
  },
};
