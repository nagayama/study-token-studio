/**
 * Token Studio の出力から core/light, core/dark を
 * 個別のトークンファイルに分割するスクリプト
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const input = JSON.parse(readFileSync("./tokens/token.json", "utf-8"));

const sets = input.$metadata?.tokenSetOrder ?? [];

for (const set of sets) {
  if (!input[set]) continue;
  const filename = `./tokens/${set.replace("/", "-")}.json`;
  writeFileSync(filename, JSON.stringify(input[set], null, 2) + "\n");
  console.log(`wrote ${filename}`);
}
