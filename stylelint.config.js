export default {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["dist/**", "node_modules/**", "src/winui/**", "src-tauri/**"],
  rules: {
    "custom-property-pattern": null,
    "selector-class-pattern": null,
    "keyframes-name-pattern": null,
    "value-keyword-case": null,
    // Prototype keeps legacy rgba() for WinUI theme compat
    "color-function-notation": null,
    "alpha-value-notation": null,
    // Icon font needs quotes, no generic fallback
    "font-family-name-quotes": null,
    "font-family-no-missing-generic-family-keyword": null,
    // Intentional override of vendored theme.css lock + longhand overflow
    "no-duplicate-selectors": null,
    "declaration-block-no-redundant-longhand-properties": null,
    "declaration-empty-line-before": null,
    "media-feature-range-notation": null,
    "no-descending-specificity": null,
  },
};
