import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * ESLint flat config.
 *
 * `eslint-config-next` v16 ships native flat configs, so no `FlatCompat`
 * shim is needed - these are plain arrays that spread straight in.
 *
 * @type {import("eslint").Linter.Config[]}
 */
const config = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },

  ...nextCoreWebVitals,
  ...nextTypescript,

  {
    rules: {
      // `any` opts out of the type system entirely - ban it outright.
      // Use `unknown` plus a narrowing check when a value is genuinely dynamic.
      "@typescript-eslint/no-explicit-any": "error",

      // Underscore-prefixed args are an intentional "unused on purpose".
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // Prefer `import type` so types are erased cleanly at build time.
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];

export default config;
