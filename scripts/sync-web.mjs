#!/usr/bin/env node
// Copies compiled ABIs from contracts/out/ to web/src/lib/abis/ as ts modules.
// Run from repo root: `node scripts/sync-web.mjs` (or `pnpm contracts:sync-web`).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, "contracts", "out");
const dest = path.join(repoRoot, "web", "src", "lib", "abis");

const targets = [
  ["MockUSDC", "MockUSDC.sol/MockUSDC.json"],
  ["EscrowFactory", "EscrowFactory.sol/EscrowFactory.json"],
  ["Escrow", "Escrow.sol/Escrow.json"],
];

fs.mkdirSync(dest, { recursive: true });

for (const [name, rel] of targets) {
  const artifact = JSON.parse(fs.readFileSync(path.join(outDir, rel), "utf8"));
  const abi = artifact.abi;
  const tsPath = path.join(dest, `${name}.ts`);
  const tsContent = `// AUTO-GENERATED — do not edit. Source: contracts/out/${rel}\nexport const ${name}Abi = ${JSON.stringify(abi, null, 2)} as const;\n`;
  fs.writeFileSync(tsPath, tsContent);
  console.log(`wrote ${path.relative(repoRoot, tsPath)} (${abi.length} entries)`);
}
