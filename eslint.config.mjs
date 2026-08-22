import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "node_modules/**",
      "convex/_generated/**",
      ".cache/**",
      ".turbo/**",
      "coverage/**",
    ],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      // Add any custom rules here
      "@next/next/no-img-element": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
