import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  // {
  //   rules: {
  //     // Deteksi variabel tidak digunakan
  //     "no-unused-vars": [
  //       "warn",
  //       {
  //         vars: "all", // periksa semua variabel
  //         args: "after-used", // periksa parameter yang tidak dipakai
  //         ignoreRestSiblings: true, // abaikan saat destructuring (...rest)
  //         argsIgnorePattern: "^_", // abaikan argumen yang diawali _
  //         varsIgnorePattern: "^_", // abaikan variabel yang diawali _
  //       },
  //     ],
  //   },
  // },
];

export default eslintConfig;
