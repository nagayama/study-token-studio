import { globSync } from "node:fs";
import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";
import tailwind from "@terrazzo/plugin-tailwind";

// Terrazzo v0.10 はグロブ未対応のため、手動で展開する
const tokenFiles = [
  ...globSync("./tokens/variables/*.json"),
  ...globSync("./tokens/styles/*.json"),
].map((f) => (f.startsWith("./") ? f : `./${f}`));

export default defineConfig({
  tokens: tokenFiles.length > 0 ? tokenFiles : ["./tokens.json"],
  outDir: "./generated/",
  plugins: [
    css({
      filename: "tokens.css",
      modeSelectors: [
        {
          mode: "Light",
          selectors: [
            '@media (prefers-color-scheme: light)',
            '[data-theme="light"]',
          ],
        },
        {
          mode: "Dark",
          selectors: [
            '@media (prefers-color-scheme: dark)',
            '[data-theme="dark"]',
          ],
        },
      ],
    }),
    tailwind({
      filename: "tailwind-tokens.js",
      theme: {
        // トークン構造に合わせて調整する
        // 例: "color": ["color.*"] で color 配下のトークンを Tailwind の color に割り当て
        color: ["color.*"],
      },
    }),
  ],
});
