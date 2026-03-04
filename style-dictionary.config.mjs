import StyleDictionary from "style-dictionary";
import { readFileSync } from "node:fs";

// Token Studio の出力を直接読み、light/dark を対にして扱う
const raw = JSON.parse(readFileSync("./tokens/token.json", "utf-8"));
const lightTokens = raw["core/light"];
const darkTokens = raw["core/dark"];

// トークンツリーをフラットに展開する
// { color: { text: { primary: { $value: "#000" } } } }
// → [{ path: ["color","text","primary"], $value: "#000", $type: "color" }]
function flatten(obj, path = []) {
  const result = [];
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;
    if (value.$value !== undefined) {
      result.push({ path: [...path, key], ...value });
    } else {
      result.push(...flatten(value, [...path, key]));
    }
  }
  return result;
}

const light = flatten(lightTokens);
const dark = flatten(darkTokens);

// CSS 変数名を生成 (color.text.primary → --color-text-primary)
const cssVar = (token) => `--${token.path.join("-")}`;

// Tailwind テーマ変数名 (color.text.primary → --text-color-primary)
// path: ["color", "text", "primary"] → "text" 以降を使う
const twVar = (token) => `--text-color-${token.path.slice(2).join("-")}`;

// 1ファイルにまとめる: @theme + :root(light) + .dark
StyleDictionary.registerFormat({
  name: "css/tailwind-modes",
  format: () => {
    const themeVars = light
      .map((t) => `  ${twVar(t)}: var(${cssVar(t)});`)
      .join("\n");
    const lightVars = light
      .map((t) => `  ${cssVar(t)}: ${t.$value};`)
      .join("\n");
    const darkVars = dark
      .map((t) => `  ${cssVar(t)}: ${t.$value};`)
      .join("\n");

    return [
      `@import "tailwindcss";`,
      ``,
      `@theme {`,
      themeVars,
      `}`,
      ``,
      `:root {`,
      lightVars,
      `}`,
      ``,
      `.dark {`,
      darkVars,
      `}`,
      ``,
    ].join("\n");
  },
});

// source は Style Dictionary の仕組み上必要だが、フォーマット内で独自にトークンを処理している
export default {
  source: ["./tokens/token.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "./dist-sd/",
      files: [
        {
          destination: "tailwind-theme.css",
          format: "css/tailwind-modes",
        },
      ],
    },
  },
};
