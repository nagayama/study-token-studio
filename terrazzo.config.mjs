import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";
import tailwind from "@terrazzo/plugin-tailwind";

const theme = process.env.THEME || "light";

export default defineConfig({
  tokens: [`./tokens/core-${theme}.json`],
  outDir: `./dist/${theme}`,
  plugins: [
    css({
      filename: "tokens.css",
    }),
    tailwind({
      filename: "tailwind-theme.css",
      theme: {
        "text-color": ["color.text.*"],
      },
    }),
  ],
});
