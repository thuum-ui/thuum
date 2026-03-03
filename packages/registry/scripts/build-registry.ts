import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

const ROOT = dirname(import.meta.dirname);
const DIST = join(ROOT, "dist");

interface RegistryFileEntry {
  path: string;
  source: string;
}

interface RegistryItem {
  name: string;
  type: string;
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFileEntry[];
}

interface Registry {
  name: string;
  items: RegistryItem[];
}

const registry: Registry = JSON.parse(
  readFileSync(join(ROOT, "registry.json"), "utf-8")
);

if (!existsSync(DIST)) {
  mkdirSync(DIST, { recursive: true });
}

const index: { name: string; type: string; dependencies: string[]; registryDependencies: string[] }[] = [];

for (const item of registry.items) {
  const files = item.files.map((f) => ({
    path: f.path,
    content: readFileSync(join(ROOT, f.source), "utf-8"),
  }));

  const output = {
    name: item.name,
    type: item.type,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    files,
  };

  writeFileSync(join(DIST, `${item.name}.json`), JSON.stringify(output, null, 2));

  index.push({
    name: item.name,
    type: item.type,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
  });
}

writeFileSync(join(DIST, "index.json"), JSON.stringify(index, null, 2));

console.log(`Built ${registry.items.length} registry items to ${DIST}`);
